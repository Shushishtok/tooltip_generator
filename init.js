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
    if (fs.existsSync(resourcePath)) {
        console.log("Checking if tsconfig.json exists in " + filePath);
        if (fs.existsSync(filePath)) {
            console.log("tsconfig.json found!");
            var resultPath = resourcePath + "/tsconfig.json";
            fs.copyFileSync(filePath, resultPath);
            console.log("tsconfig.json copied to " + resultPath + " folder");
        }
        filePath = __dirname + "/ModifierProperties.d.ts";
        console.log("Checking if ModifierProperties.d.ts exists in " + filePath);
        if (fs.existsSync(filePath)) {
            console.log("ModifierProperties.d.ts found!");
            var resultPath = resourcePath + "/ModifierProperties.d.ts";
            fs.copyFileSync(filePath, resultPath);
            console.log("ModifierProperties.d.ts copied to " + resultPath + " folder");
        }
        filePath = __dirname + "/languages.ts";
        console.log("Checking if languages.ts exsts in " + filePath);
        if (fs.existsSync(filePath)) {
            console.log("languages.ts found!");
            var resultPath = resourcePath + "/languages.ts";
            fs.copyFileSync(filePath, resultPath);
            console.log("languages.ts copied to " + resultPath + " folder");
        }
    }
    var dirPath = __dirname + "/localization";
    if (fs.existsSync(filePath) && fs.existsSync(resourcePath)) {
        var resultPath = resourcePath + "/localization";
        console.log("Checking if localization folder exists in " + resultPath);
        if (!fs.existsSync(resultPath)) {
            fs.mkdirSync(resultPath);
            console.log("localization folder not found, creating the folder.");
        }
        console.log("Checking if localizationData example files exist in folder");
        if (!fs.existsSync(resultPath + "/localizationData.ts")) {
            fs.copyFileSync(dirPath + "/localizationData.ts", resultPath + "/localizationData.ts");
            console.log("localizationData example files do not exist: created at " + resultPath);
        }
        if (!fs.existsSync(resultPath + "/localizationData.js")) {
            fs.copyFileSync(dirPath + "/localizationData.js", resultPath + "/localizationData.js");
        }
    }
    console.log("\x1b[36m%s\x1b[0m", "Finished copy process!");
}
function changeImports() {
    var filePath = __dirname + "/localizationCompiler.ts";
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var result = data.replace('import { Language } from "./languages"', 'import { Language } from "~resource/languages"');
            fs.writeFile(filePath, result, 'utf8', function (err) {
                if (err)
                    return console.log(err);
            });
        });
    }
    filePath = __dirname + "/localizationInterfaces.ts";
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var result = data.replace('import { Language } from "./languages"', 'import { Language } from "~resource/languages"');
            fs.writeFile(filePath, result, 'utf8', function (err) {
                if (err)
                    return console.log(err);
            });
        });
    }
}
copyFiles();
changeImports();
