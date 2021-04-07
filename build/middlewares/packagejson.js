"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const json_1 = require("../utils/json");
const validatePackageJson = (data, filename) => {
    const errors = [];
    if (typeof data !== "object") {
        errors.push("Configuration file must have object in root");
    }
    if ((data === null || data === void 0 ? void 0 : data.name) === void 0) {
        errors.push("No required field 'name' in config");
    }
    else if (typeof (data === null || data === void 0 ? void 0 : data.name) !== "string") {
        errors.push("Field 'name' in config must be a string");
    }
    if ((data === null || data === void 0 ? void 0 : data.version) === void 0) {
        errors.push("No required field 'version' in config");
    }
    else if (typeof (data === null || data === void 0 ? void 0 : data.version) !== "string") {
        errors.push("Field 'version' in config must be a string");
    }
    if (errors.length > 0) {
        throw new Error(`Errors at ${filename}:\n\n${errors.join("\n")}`);
    }
};
const middleware = (argv) => {
    const packagejson = json_1.readJson(path_1.resolve(argv.config));
    validatePackageJson(packagejson, argv.config);
    argv.packagejson = packagejson;
    return argv;
};
exports.default = middleware;
