"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsPromise = void 0;
const https_1 = __importDefault(require("https"));
const httpsPromise = (urlOptions, data) => {
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(urlOptions, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk.toString()));
            res.on("error", reject);
            res.on("end", () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body,
                    });
                }
                else {
                    reject(new Error("Request failed. status: " + res.statusCode + ", body: " + body));
                }
            });
        });
        req.on("error", reject);
        if (data)
            req.write(data, "binary");
        req.end();
    });
};
exports.httpsPromise = httpsPromise;
