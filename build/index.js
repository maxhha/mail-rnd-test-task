#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const chalk_1 = __importDefault(require("chalk"));
const helpers_1 = require("yargs/helpers");
const packagejson_1 = __importDefault(require("./middlewares/packagejson"));
const install_1 = __importDefault(require("./commands/install"));
const info_1 = __importDefault(require("./commands/info"));
const parser = yargs_1.default(helpers_1.hideBin(process.argv))
    .option("config", {
    type: "string",
    description: "path to file with configuration",
    default: "package.json",
})
    .middleware(packagejson_1.default)
    .command(info_1.default)
    .command(install_1.default)
    .strict()
    .demandCommand(1);
(async () => {
    try {
        const argv = await parser.parse();
    }
    catch (err) {
        console.error(chalk_1.default.red(err.message));
    }
})();
