"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateSelectorMap;
exports.decodeBitmask = decodeBitmask;
exports.decodeBitmaskIndexes = decodeBitmaskIndexes;
exports.getMaxBitmaskValue = getMaxBitmaskValue;
const QuerySortOrder = {
    tag: 1,
    id: 2,
    class: 3,
    attr: 4,
    index: 5,
};
const RankByType = {
    id: 1,
    class: 2,
    tag: 3,
    attr: 4,
    index: 2,
};
/**
 * Ancestor patterns are just bitmasks of the Permutations 2^<ancestor length> -1. 2 = ['11','01','10'] = [3,1,2]
 * Selector options are also just bitmasks of available options 2^[options.length] -1.
 * Start at current element - check for any unique patterns.
 * Count querySelectorAll to see if there's exactly 1 matching element
 */
function generateSelectorMap(element, boundary = document, iterationsBeforeFirstBreak = 50e3) {
    const target = generateTarget(element, boundary);
    const ancestors = generateAncestors(element, boundary);
    const context = {
        target,
        ancestors,
        boundary,
        selectors: [],
        nodePath: createNodePath(target, ancestors),
    };
    const emptyAncestorMasks = ancestors.map(() => 0n);
    getSelectorCounts(context, emptyAncestorMasks);
    // sorted by least layers involved
    const allSelectorOptions = generateAllLayerOptions(ancestors);
    const maxSelectorCombinationBitmask = getMaxBitmaskValue(allSelectorOptions);
    // console.log('Checking combinations. First 50...', allSelectorOptions);
    // get bitmask of all the combined options (NOTE: we could just combine here, but just means creating arrays upfront)
    const selectorHistory = new Set();
    let counter = 0n;
    let nextBreakpoint = iterationsBeforeFirstBreak;
    iterateBitmaskBySubsets(maxSelectorCombinationBitmask, mask => {
        const selectorPermutations = decodeBitmask(mask, allSelectorOptions);
        const { selector, rankSum, layerBitmasks } = createAncestorSelector(selectorPermutations, context.ancestors);
        if (selectorHistory.has(selector))
            console.warn('Selector already tried', selector, {
                rankSum,
                layerBitmasks,
                selectorPermutations,
            });
        counter += getSelectorCounts(context, layerBitmasks, selector, rankSum);
        if (counter > nextBreakpoint) {
            nextBreakpoint += 10e3;
            // eslint-disable-next-line no-console
            console.log('Checking for matches after %s permutations', counter, context.selectors.length);
            if (context.selectors.length)
                return false;
        }
        return true;
    });
    context.selectors.sort((a, b) => a.rank - b.rank);
    return context;
}
function generateAllLayerOptions(ancestors) {
    const allCombinedOptions = [];
    for (const ancestor of [...ancestors].reverse()) {
        for (let i = 0; i < ancestor.selectorOptions.length; i += 1) {
            const selectorOption = ancestor.selectorOptions[i];
            allCombinedOptions.push({
                element: ancestor.element,
                selectorOption,
                index: i,
            });
        }
    }
    // put smallest at end
    allCombinedOptions.sort((a, b) => {
        return b.selectorOption.rank - a.selectorOption.rank;
    });
    return allCombinedOptions;
}
function createAncestorSelector(selectorPermutations, ancestors) {
    const selectorMaskByElement = new Map();
    for (const combo of selectorPermutations) {
        let value = selectorMaskByElement.get(combo.element) ?? 0n;
        if (!value) {
            selectorMaskByElement.set(combo.element, value);
        }
        value |= 1n << BigInt(combo.index);
        selectorMaskByElement.set(combo.element, value);
    }
    const layerBitmasks = [];
    const selectorParts = [];
    let totalRankSum = 0;
    let isAdjacent = false;
    for (const ancestor of ancestors) {
        const bitmask = selectorMaskByElement.get(ancestor.element) ?? 0n;
        layerBitmasks.push(bitmask);
        if (bitmask === 0n) {
            isAdjacent = false;
            continue;
        }
        const { selector, rankSum } = createSelector(bitmask, ancestor);
        if (isAdjacent)
            selectorParts.push('>');
        selectorParts.push(selector);
        totalRankSum += rankSum;
        isAdjacent = true;
    }
    const ancestorSelector = selectorParts.join(' ');
    return { layerBitmasks, selector: ancestorSelector, rankSum: totalRankSum };
}
function getSelectorCounts(context, ancestorBitmasks, baseSelector, startRankSum) {
    let joiner = ' ';
    if (baseSelector) {
        if (ancestorBitmasks[ancestorBitmasks.length - 1] !== 0n)
            joiner = ' > ';
    }
    const maxSelectorBitmask = getMaxBitmaskValue(context.target.selectorOptions);
    for (let targetBitmask = 1n; targetBitmask <= maxSelectorBitmask; targetBitmask += 1n) {
        const { selector, rankSum } = createSelector(targetBitmask, context.target);
        let finalSelector = selector;
        if (baseSelector) {
            finalSelector = [baseSelector, selector].join(joiner);
        }
        try {
            const results = context.boundary.querySelectorAll(finalSelector);
            const count = results.length;
            if (count !== 1)
                continue;
            let isMatch = false;
            for (const result of results) {
                if (result.isEqualNode(context.target.element)) {
                    isMatch = true;
                    break;
                }
            }
            if (!isMatch)
                continue;
            context.selectors.push({
                targetBitmask,
                ancestorBitmasks,
                rank: rankSum + (startRankSum ?? 0),
                selector: finalSelector,
            });
        }
        catch (err) {
            console.error('Error running selector "%s" to create counts', finalSelector, err);
            throw err;
        }
    }
    return maxSelectorBitmask;
}
function createSelector(selectorBitmask, target) {
    const selectorItems = decodeBitmask(selectorBitmask, target.selectorOptions);
    selectorItems.sort((a, b) => {
        const aOrder = QuerySortOrder[a.type];
        const bOrder = QuerySortOrder[b.type];
        return aOrder - bOrder;
    });
    let rankSum = 0;
    let selector = '';
    for (const item of selectorItems) {
        rankSum += item.rank;
        if (item.valueAsOnlyOption && selectorItems.length === 1) {
            selector += item.valueAsOnlyOption;
        }
        else {
            selector += item.value;
        }
    }
    return { selector, rankSum };
}
function getHeroNodeId(element) {
    if (typeof NodeTracker === 'undefined')
        return 0;
    return NodeTracker.getNodeId(element);
}
function generateTarget(element, boundary) {
    const selectorOptions = extractSelectorOptions(element, boundary);
    const heroNodeId = getHeroNodeId(element);
    return { element, selectorOptions, heroNodeId };
}
function generateAncestors(element, boundary) {
    const ancestors = [];
    while (element) {
        element = element.parentElement;
        if (!element)
            return ancestors;
        const selectorOptions = extractSelectorOptions(element, boundary, ancestors.length);
        const heroNodeId = getHeroNodeId(element);
        ancestors.unshift({ element, selectorOptions, heroNodeId });
        if (element.localName === 'body')
            break;
    }
    return ancestors;
}
function extractSelectorOptions(element, boundary, layerDistance = 0) {
    const tagName = element.localName;
    const id = element.id && !element.id.match(/^[0-9]/) ? `#${element.id}` : null;
    const classes = Array.from(element.classList).map(x => `.${x}`);
    const attrNames = element.getAttributeNames().filter(k => !['class'].includes(k));
    const attrs = attrNames.map(x => {
        const v = element.getAttribute(x);
        // only treat ID as an attribute if it starts with a number
        if (x === 'id' && v && !v.match(/^[0-9]/))
            return;
        return `[${x}="${v}"]`;
    });
    const options = [
        { type: 'id', rank: RankByType.id, value: id },
        ...classes.map(value => ({ type: 'class', rank: RankByType.class, value })),
        { type: 'tag', rank: RankByType.tag, value: tagName },
        ...attrs.map(value => ({ type: 'attr', rank: RankByType.attr, value })),
    ]
        .filter(x => x.value !== undefined && x.value !== null)
        .map((x) => {
        x.domMatches = boundary.querySelectorAll(x.value).length;
        return x;
    })
        .sort((a, b) => {
        if (a.domMatches === b.domMatches)
            return a.rank - b.rank;
        return a.domMatches - b.domMatches;
    });
    // exponentially value closer nodes more
    const distanceRank = 2 ** layerDistance;
    // re-rank by hierarchy position and dom uniqueness
    for (const option of options) {
        option.rank = option.domMatches + distanceRank;
    }
    if (tagName !== 'body') {
        const parentNode = element.parentNode;
        const siblingIndex = Array.prototype.indexOf.call(parentNode.children, element);
        const indexOption = {
            type: 'index',
            rank: RankByType.attr + distanceRank,
            value: `:nth-child(${siblingIndex + 1})`,
            domMatches: 1,
        };
        // build a default option for the index
        const indexParts = [tagName, options.find(x => x.type === 'class')?.value, indexOption.value];
        indexOption.valueAsOnlyOption = indexParts.filter(Boolean).join('');
        options.push(indexOption);
    }
    return options;
}
function createNodePath(target, ancestors) {
    const paths = [];
    for (const node of [...ancestors, target]) {
        const tag = node.selectorOptions.find(x => x.type === 'tag');
        const index = node.selectorOptions.find(x => x.type === 'index');
        let entry = tag.value;
        if (index) {
            entry += index.value;
        }
        paths.push(entry);
    }
    return paths.join('>');
}
function iterateBitmaskBySubsets(bitmask, iterateFn) {
    /**
     * We need to iterate in order of subset groups. Groups of 1, then groups of 2, etc, etc.
     * This needs to happen in order. Look up Gosper's hack for details of the approach used below.
     */
    const digits = bitmask.toString(2).length;
    const maxValue = 1n << BigInt(digits);
    for (let subsetDigits = 1n; subsetDigits <= digits; subsetDigits += 1n) {
        let subsetBitmask = (1n << subsetDigits) - 1n;
        while (subsetBitmask < maxValue) {
            if (!iterateFn(subsetBitmask))
                return;
            // Gosper's hack to find the next subset of maskDigits length
            const c = subsetBitmask & -subsetBitmask; // c is equal to the rightmost 1-bit in set.
            const r = subsetBitmask + c; // clear out the rightmost cluster of 1-bits in set and puts a 1 in the first zero left of the rightmost cluster of 1 bits
            subsetBitmask = (((r ^ subsetBitmask) >> 2n) / c) | r;
        }
    }
}
function decodeBitmask(bitmask, options) {
    const results = [];
    for (let i = 0; i < options.length; i += 1) {
        const optionBit = 1n << BigInt(i);
        if (bitmask & optionBit)
            results.push(options[i]);
    }
    return results;
}
function decodeBitmaskIndexes(bitmask, options) {
    const results = [];
    for (let i = 0; i < options.length; i += 1) {
        const optionBit = 1n << BigInt(i);
        if (bitmask & optionBit)
            results.push(i);
    }
    return results;
}
function getMaxBitmaskValue(options) {
    if (!options.length)
        return 0n;
    // a bitmask will yield all spots
    // 010 = 2 - second spot activated
    // reversing the order means the first entry will have the lowest value
    return 2n ** BigInt(options.length) - 1n;
}
//# sourceMappingURL=generateSelectorMap.js.map