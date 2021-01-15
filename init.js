"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
function copyFiles() {
    console.log("Copying initial files...");
    var resourcePath = "node_modules/~resource";
    var filePath = __dirname + "/tsconfig.json";
    if (fs.existsSync(filePath) && fs.existsSync(resourcePath)) {
        var resultPath = resourcePath + "/tsconfig.json";
        fs.copyFileSync(filePath, resultPath);
    }
    filePath = __dirname + "/ModifierProperties.d.ts";
    if (fs.existsSync(filePath) && fs.existsSync(resourcePath)) {
        var resultPath = resourcePath + "/ModifierProperties.d.ts";
        fs.copyFileSync(filePath, resultPath);
    }
    var dirPath = __dirname + "/localization";
    if (fs.existsSync(filePath) && fs.existsSync(resourcePath)) {
        var resultPath = resourcePath + "/localization";
        if (!fs.existsSync(resultPath)) {
            fs.mkdirSync(resultPath);
        }
        if (!fs.existsSync(resultPath + "/localizationData.ts")) {
            fs.copyFileSync(dirPath + "/localizationData.ts", resultPath + "/localizationData.ts");
        }
        if (!fs.existsSync(resultPath + "/localizationData.js")) {
            fs.copyFileSync(dirPath + "/localizationData.js", resultPath + "/localizationData.js");
        }
    }
    console.log("\x1b[36m%s\x1b[0m", "Finished copy process!");
}
copyFiles();
