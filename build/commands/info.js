"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const DEPENDENCIES_FIELDS = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "bundledDependencies",
    "optionalDependencies",
];
const command = {
    command: "info",
    describe: "list info of a project",
    handler: (argv) => {
        console.log(chalk_1.default.gray(`${path_1.default.resolve(argv.config)}:`));
        const parsed = argv.packagejson;
        console.log(`${parsed.name}@${parsed.version}\n`);
        let showedAtLeastOnce = false;
        for (let depsField of DEPENDENCIES_FIELDS) {
            const deps = parsed[depsField];
            if (!deps)
                continue;
            showedAtLeastOnce = true;
            console.log(chalk_1.default.yellow(`${depsField}:`));
            for (let [dep, ver] of Object.entries(deps)) {
                console.log(`  ${dep}@${ver}`);
            }
            console.log();
        }
        if (!showedAtLeastOnce) {
            console.log(chalk_1.default.gray(`no dependencies`));
        }
    },
};
exports.default = command;
