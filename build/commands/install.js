"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const https_1 = require("../utils/https");
const command = {
    command: ["install <packages...>", "i"],
    describe: "add packages to your dependencies",
    handler: async (argv) => {
        var _a, _b, _c;
        console.debug(`Read data from config "${argv.config}"`);
        const data = fs_1.readFileSync(argv.config, "utf8");
        console.debug("Parse json");
        const parsed = JSON.parse(data);
        console.debug("Add new dependencies");
        if (!parsed.dependencies) {
            parsed.dependencies = {};
        }
        for await (let dep of argv.packages) {
            const m = dep.match(/^(.+)@(.+)$/);
            const pack = (_a = m === null || m === void 0 ? void 0 : m[1]) !== null && _a !== void 0 ? _a : dep;
            const tag = (_b = m === null || m === void 0 ? void 0 : m[2]) !== null && _b !== void 0 ? _b : "latest";
            const resp = await https_1.httpsPromise(`https://registry.npmjs.org/${pack}`);
            const data = JSON.parse(resp.body);
            const ver = (_c = data["dist-tags"][tag]) !== null && _c !== void 0 ? _c : tag;
            parsed.dependencies[pack] = ver;
        }
        console.debug("Save file");
        fs_1.writeFileSync(argv.config, JSON.stringify(parsed, void 0, 2));
    },
};
exports.default = command;
