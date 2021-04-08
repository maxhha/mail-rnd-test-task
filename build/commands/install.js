"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const https_1 = require("../utils/https");
const chalk_1 = __importDefault(require("chalk"));
const semver_1 = __importDefault(require("semver"));
const NPM_REGISTER = "https://registry.npmjs.org";
const validateDependency = async (dep) => {
    var _a, _b, _c;
    const m = dep.match(/^(@[a-z0-9\-]+\/)?([a-z0-9_-]*)(@[.a-z0-9_-]+)?$/);
    if (!m) {
        throw new Error(`Invalid dependency "${dep}". Dependencies only in format [@scope/]<package>[@tag|semver] are supported`);
    }
    const scope = m[1];
    const pack = m[2];
    const tagOrSemver = m[3];
    const scopePackage = (scope || "") + pack;
    const resp = await https_1.httpsPromise(`${NPM_REGISTER}/${encodeURIComponent(scopePackage)}`).catch((error) => {
        throw new Error(`Cant find "${scopePackage}" in npm register`);
    });
    const data = JSON.parse(resp.body);
    const packageVerisions = Object.keys((_a = data === null || data === void 0 ? void 0 : data.versions) !== null && _a !== void 0 ? _a : {});
    const range = semver_1.default.validRange(tagOrSemver);
    const version = semver_1.default.valid(tagOrSemver);
    const ver = tagOrSemver
        ? (((_b = data === null || data === void 0 ? void 0 : data["dist-tags"]) === null || _b === void 0 ? void 0 : _b[tagOrSemver]) && tagOrSemver) ||
            (version && packageVerisions.includes(version) && version) ||
            (range && semver_1.default.maxSatisfying(packageVerisions, range) && range)
        : ((_c = data === null || data === void 0 ? void 0 : data["dist-tags"]) === null || _c === void 0 ? void 0 : _c["latest"]) && "^" + data["dist-tags"].latest;
    if (!ver) {
        throw new Error(`Cant find any version for "${dep}"`);
    }
    return { ver, name: data.name };
};
const TYPE_TO_DEPENDENCY_NAME = {
    dev: "devDependencies",
    peer: "peerDependencies",
    bundle: "bundledDependencies",
    opt: "optionalDependencies",
};
const command = {
    command: ["install [type] <packages...>", "i"],
    describe: "add packages to your dependencies",
    builder: (yargs) => yargs.positional("type", {
        aliases: ["t"],
        choices: ["dev", "peer", "bundle", "opt"],
    }),
    handler: async (argv) => {
        const depsName = argv.type
            ? TYPE_TO_DEPENDENCY_NAME[argv.type]
            : "dependencies";
        const parsed = argv.packagejson;
        if (!parsed[depsName]) {
            parsed[depsName] = {};
        }
        else if (typeof parsed[depsName] !== "object") {
            throw new Error("Field 'dependencies' in config file is not an object");
        }
        const errors = [];
        for await (let dep of argv.packages) {
            try {
                const { name, ver } = await validateDependency(dep);
                parsed[depsName][name] = ver;
                console.log(chalk_1.default.green(`✅ ${name}@${ver}`));
            }
            catch (err) {
                errors.push(err);
                console.log(chalk_1.default.red(`❌ ${dep}`));
            }
        }
        if (errors.length > 0) {
            for (let error of errors) {
                console.error(chalk_1.default.red(error.message));
            }
        }
        else {
            fs_1.writeFileSync(argv.config, JSON.stringify(parsed, void 0, 2));
            console.log(chalk_1.default.green("\nSaved!"));
        }
    },
};
exports.default = command;
