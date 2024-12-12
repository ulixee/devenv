"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexerAny = exports.lexer = void 0;
exports.trackingComments = trackingComments;
exports.tracking = tracking;
exports.track = track;
exports.box = box;
exports.doubleQuoted = doubleQuoted;
exports.unbox = unbox;
const moo_1 = require("moo");
const keywords_1 = require("./keywords");
// build keywords
const keywordsMap = {};
for (const k of keywords_1.sqlKeywords) {
    keywordsMap[`kw_${k.toLowerCase()}`] = k;
}
function caseInsensitiveKeywords(map) {
    const transform = (0, moo_1.keywords)(map);
    return (text) => transform(text.toUpperCase());
}
// build lexer
exports.lexer = (0, moo_1.compile)({
    word: {
        match: /[eE](?!')[A-Za-z0-9_]*|[a-df-zA-DF-Z_][A-Za-z0-9_]*/,
        type: caseInsensitiveKeywords(keywordsMap),
        value: x => keywordsMap[`kw_${x.toLowerCase}`] ? x.toLowerCase() : x,
    },
    wordQuoted: {
        match: /"(?:[^"*]|"")+"/,
        type: () => 'quoted_word',
        value: x => x.substring(1, x.length - 1),
    },
    string: {
        match: /'(?:[^']|'')*'/,
        value: x => {
            return x.substring(1, x.length - 1)
                .replace(/''/g, '\'');
        },
    },
    eString: {
        match: /\b(?:e|E)'(?:[^'\\]|[\r\n\s]|(?:\\\s)|(?:\\\n)|(?:\\.)|(?:''))+'/,
        value: x => {
            return x.substring(2, x.length - 1)
                .replace(/''/g, '\'')
                .replace(/\\([\s\n])/g, (_, y) => y)
                .replace(/\\./g, m => JSON.parse(`"${m}"`));
        },
    },
    qparam: {
        match: /\$\d+/,
    },
    commentLine: /--.*?$[\s\r\n]*/,
    commentFullOpen: /\/\*/,
    commentFullClose: /\*\/[\s\r\n]*/,
    star: '*',
    comma: ',',
    space: { match: /[\s\t\n\v\f\r]+/, lineBreaks: true, },
    int: /-?\d+(?![.\d])/,
    float: /-?(?:(?:\d*\.\d+)|(?:\d+\.\d*))/,
    // word: /[a-zA-Z][A-Za-z0-9_\-]*/,
    lparen: '(',
    rparen: ')',
    lbracket: '[',
    rbracket: ']',
    semicolon: ';',
    dot: /\.(?!\d)/,
    op_cast: '::',
    op_colon: ':',
    op_plus: '+',
    op_assignment: '=>',
    op_eq: '=',
    op_neq: {
        match: /(?:!=)|(?:<>)/,
        value: () => '!=',
    },
    op_membertext: '->>',
    op_member: '->',
    op_minus: '-',
    op_div: /\//,
    op_not_ilike: /!~~\*/, // !~~* =ILIKE
    op_not_like: /!~~/, // !~~ =LIKE
    op_ilike: /~~\*/, // ~~* =ILIKE
    op_like: /~~/, // ~~ =LIKE
    op_mod: '%',
    op_exp: '^',
    op_additive: {
        // group other additive operators
        match: ['||', '-', '#-', '&&'],
    },
    op_compare: {
        // group other comparison operators
        // ... to add: "IN" and "NOT IN" that are matched by keywords
        match: ['>', '>=', '<', '<=', '@>', '<@', '?', '?|', '?&', '#>>', '>>', '<<', '~', '~*', '!~', '!~*'],
    },
    ops_others: {
        // referenced as (any other operator) in https://www.postgresql.org/docs/12/sql-syntax-lexical.html#SQL-PRECEDENCE
        // see also https://www.postgresql.org/docs/9.0/functions-math.html
        match: ['|', '&', '^', '#'],
    },
    codeblock: {
        match: /\$\$(?:.|[\s\t\n\v\f\r])*?\$\$/s,
        lineBreaks: true,
        value: (x) => x.substring(2, x.length - 2),
    },
});
exports.lexer.next = (next => () => {
    let tok;
    let commentFull = null;
    // eslint-disable-next-line no-cond-assign
    while (tok = next.call(exports.lexer)) {
        // js regex can't be recursive, so we'll keep track of nested opens (/*) and closes (*/).
        if (tok.type === 'commentFullOpen') {
            if (commentFull === null) { // initial open - start collecting content
                commentFull = {
                    nested: 0,
                    offset: tok.offset,
                    text: tok.text
                };
                continue;
            }
            commentFull.nested++;
        }
        if (commentFull != null) {
            // collect comment content
            commentFull.text += tok.text;
            if (tok.type === 'commentFullClose') {
                if (commentFull.nested === 0) { // finish comment, if not nested
                    comments?.push(makeComment(commentFull));
                    commentFull = null;
                    continue;
                }
                commentFull.nested--;
            }
            continue;
        }
        if (tok.type === 'space') {
            continue;
        }
        if (tok.type === 'commentLine') {
            comments?.push(makeComment(tok));
            continue;
        }
        break;
    }
    if (trackingLoc && tok) {
        const start = tok.offset;
        const loc = {
            start,
            end: start + tok.text.length,
        };
        tok._location = loc;
    }
    return tok;
})(exports.lexer.next);
exports.lexerAny = exports.lexer;
let comments = null;
const makeComment = ({ offset, text }) => ({
    _location: { start: offset, end: offset + text.length },
    comment: text,
});
function trackingComments(act) {
    if (comments) {
        throw new Error('WAT ? Recursive comments tracking 🤔🤨 ?');
    }
    try {
        comments = [];
        const ast = act();
        return { comments, ast };
    }
    finally {
        comments = null;
    }
}
let trackingLoc = false;
function tracking(act) {
    if (trackingLoc) {
        return act();
    }
    try {
        trackingLoc = true;
        return act();
    }
    finally {
        trackingLoc = false;
    }
}
function track(xs, ret) {
    if (!trackingLoc || !ret || typeof ret !== 'object') {
        return ret;
    }
    const start = seek(xs, true);
    const end = seek(xs, false);
    if (!start || !end) {
        return ret;
    }
    if (start === end) {
        ret._location = start;
    }
    else {
        const loc = {
            start: start.start,
            end: end.end,
        };
        ret._location = loc;
    }
    return ret;
}
const literal = Symbol('_literal');
const doubleQuotedSym = Symbol('_doublequoted');
function box(xs, value, dqSymbol) {
    if (!trackingLoc && !dqSymbol) {
        return value;
    }
    return track(xs, { [literal]: value, [doubleQuotedSym]: dqSymbol });
}
function unwrapNoBox(e) {
    if (Array.isArray(e) && e.length === 1) {
        e = unwrapNoBox(e[0]);
    }
    if (Array.isArray(e) && !e.length) {
        return null;
    }
    return e;
}
function doubleQuoted(value) {
    const uw = unwrapNoBox(value);
    if (typeof value === 'object' && uw?.[doubleQuotedSym]) {
        return { doubleQuoted: true };
    }
    return undefined;
}
function unbox(value) {
    if (typeof value === 'object') {
        return value?.[literal] ?? value;
    }
    return value;
}
function seek(xs, start) {
    if (!xs) {
        return null;
    }
    if (Array.isArray(xs)) {
        const diff = start ? 1 : -1;
        for (let i = start ? 0 : xs.length - 1; i >= 0 && i < xs.length; i += diff) {
            const v = seek(xs[i], start);
            if (v) {
                return v;
            }
        }
        return null;
    }
    if (typeof xs !== 'object') {
        return null;
    }
    return xs._location;
}
//# sourceMappingURL=lexer.js.map