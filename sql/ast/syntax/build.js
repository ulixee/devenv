const Fs = require('fs');
const Path = require('path');
const nearley = require('nearley/lib/nearley.js');
const compile = require('nearley/lib/compile.js');
const generate = require('nearley/lib/generate.js');
const lint = require('nearley/lib/lint');
const rawGrammar = require('nearley/lib/nearley-language-bootstrapped.js');
const nearleyGrammar = nearley.Grammar.fromCompiled(rawGrammar);
const nearleyFilesToLoad = ['main.ne', 'array.ne', 'geometric.ne', 'interval.ne', 'interval-iso.ne'];
function loadNearlyFile(filePath) {
    const input = Fs.readFileSync(filePath, 'utf-8');
    const parser = new nearley.Parser(nearleyGrammar);
    parser.feed(input);
    const opts = {
        args: [filePath],
        alreadycompiled: [],
    };
    const compilation = compile(parser.results[0], opts);
    lint(compilation, {});
    const ret = generate(compilation, 'grammar');
    return ret;
}
const rawDir = Path.resolve(__dirname, 'raw');
const compiledDir = Path.resolve(__dirname, 'compiled');
function loadDir(fileDir) {
    const fileNames = Fs.readdirSync(fileDir);
    for (const fileName of fileNames) {
        const filePath = Path.join(fileDir, fileName);
        const isDirectory = Fs.lstatSync(filePath).isDirectory();
        if (isDirectory) {
            loadDir(filePath);
            continue;
        }
        const relativeDir = Path.relative(rawDir, fileDir);
        const saveToDir = Path.resolve(compiledDir, relativeDir);
        if (!Fs.existsSync(saveToDir)) {
            Fs.mkdirSync(saveToDir, { recursive: true });
        }
        const isNearlyFile = fileName.match(/\.ne$/);
        if (isNearlyFile && nearleyFilesToLoad.includes(fileName)) {
            const data = loadNearlyFile(filePath);
            const saveToPath = Path.join(saveToDir, fileName.replace('.ne', '.ts'));
            Fs.writeFileSync(saveToPath, data);
        }
        else if (!isNearlyFile) {
            const copyToPath = Path.join(saveToDir, fileName);
            Fs.copyFileSync(filePath, copyToPath);
        }
    }
}
loadDir(rawDir);
//# sourceMappingURL=build.js.map