"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cliCommands;
const commander_1 = require("commander");
const { version } = require('./package.json');
function cliCommands() {
    const program = new commander_1.Command('ulixee').version(version);
    const cwd = process.cwd();
    const modules = [
        {
            name: 'datastore',
            description: 'package and upload Datastores',
            module: '@ulixee/datastore/cli',
        },
        {
            name: 'cloud',
            description: 'launch a Ulixee Cloud',
            module: '@ulixee/cloud/cli',
        },
    ];
    for (const { module, name, description } of modules) {
        try {
            const modulePath = require.resolve(module, { paths: [cwd] });
            // eslint-disable-next-line global-require,import/no-dynamic-require
            const commands = require(modulePath).default();
            commands.name(name).description(description);
            program.addCommand(commands);
        }
        catch (error) {
            program
                .command(name)
                .description(`${description} [NOT INSTALLED]`)
                .action(() => {
                console.warn(`You don't have the required Ulixee module installed in this project.\n\nnpm install --save ${module}\n\n`);
            })
                .helpOption(false);
        }
    }
    return program;
}
//# sourceMappingURL=index.js.map