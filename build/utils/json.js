"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJson = void 0;
const fs_1 = require("fs");
const parse_json_1 = __importDefault(require("parse-json"));
const readJson = (filename) => parse_json_1.default(fs_1.readFileSync(filename, "utf8"), filename);
exports.readJson = readJson;
