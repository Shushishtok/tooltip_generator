"use strict";
exports.__esModule = true;
var fs = require("fs");
function copyFiles() {
    console.log("Copying initial files...");
    var resourcePath = "node_modules/~resource";
    var filePath = __dirname + "/tsconfig.json";
    if (fs.existsSync(resourcePath)) {
        filePath = __dirname + "/tsconfig.json";
        var resultPath = resourcePath + "/tsconfig.json";
        console.log("Checking if tsconfig.json exists in " + filePath);
        if (fs.existsSync(resultPath)) {
            console.log("tsconfig.json found!");
        }
        else {
            fs.copyFileSync(filePath, resultPath);
            console.log("Not found, tsconfig.json copied to " + resultPath + " folder");
        }
        filePath = __dirname + "/ModifierProperties.d.ts";
        resultPath = resourcePath + "/ModifierProperties.d.ts";
        console.log("Checking if ModifierProperties.d.ts exists in " + filePath);
        if (fs.existsSync(resultPath)) {
            console.log("ModifierProperties.d.ts found!");
        }
        else {
            fs.copyFileSync(filePath, resultPath);
            console.log("Not found, ModifierProperties.d.ts copied to " + resultPath + " folder");
        }
        filePath = __dirname + "/languages.ts";
        resultPath = resourcePath + "/languages.ts";
        console.log("Checking if languages.ts exsts in " + filePath);
        if (fs.existsSync(resultPath)) {
            console.log("languages.ts found!");
        }
        else {
            fs.copyFileSync(filePath, resultPath);
            console.log("Not found, languages.ts copied to " + resultPath + " folder");
        }
        filePath = __dirname + "/languages.js";
        resultPath = resourcePath + "/languages.js";
        console.log("Checking if languages.js exsts in " + filePath);
        if (fs.existsSync(resultPath)) {
            console.log("languages.js found!");
        }
        else {
            fs.copyFileSync(filePath, resultPath);
            console.log("Not found, languages.js copied to " + resultPath + " folder");
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
        console.log("Checking if localization folder is empty");
        if (fs.readdirSync(resultPath).length === 0) {
            console.log("Localization folder is empty, copying example files.");
            if (!fs.existsSync(resultPath + "/localizationData.ts")) {
                fs.copyFileSync(dirPath + "/localizationData.ts", resultPath + "/localizationData.ts");
            }
            if (!fs.existsSync(resultPath + "/localizationData.js")) {
                fs.copyFileSync(dirPath + "/localizationData.js", resultPath + "/localizationData.js");
            }
        }
    }
    console.log("\x1b[36m%s\x1b[0m", "Finished copy process!");
}
function changeImports() {
    var resourcePath = "node_modules/~resource";
    var compilerFilePath = __dirname + "/localizationCompiler.ts";
    if (fs.existsSync(compilerFilePath)) {
        fs.readFile(compilerFilePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var result = data.replace('import { Language } from "./languages"', 'import { Language } from "~resource/languages"');
            fs.writeFile(compilerFilePath, result, 'utf8', function (err) {
                if (err)
                    return console.log(err);
            });
        });
    }
    var compilerJSFilePath = __dirname + "/localizationCompiler.js";
    if (fs.existsSync(compilerJSFilePath)) {
        fs.readFile(compilerJSFilePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var result = data.replace('languages_1 = require("./languages");', 'languages_1 = require("~resource/languages");');
            fs.writeFile(compilerJSFilePath, result, 'utf8', function (err) {
                if (err)
                    return console.log(err);
            });
        });
    }
    var interfacesFilePath = __dirname + "/localizationInterfaces.ts";
    if (fs.existsSync(interfacesFilePath)) {
        fs.readFile(interfacesFilePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var stringResult = data.replace('import { Language } from "./languages"', 'import { Language } from "~resource/languages"');
            fs.writeFile(interfacesFilePath, stringResult, 'utf8', function (err) {
                if (err)
                    return console.log(err);
            });
        });
    }
    var exampleFilePath = resourcePath + "/localization/localizationData.ts";
    if (fs.existsSync(exampleFilePath)) {
        fs.readFile(exampleFilePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var stringResult = data.replace('import { AbilityLocalization, LocalizationData, ModifierLocalization, GeneralLocalization } from "../localizationInterfaces";', 'import { AbilityLocalization, LocalizationData, ModifierLocalization, GeneralLocalization } from "~generator/localizationInterfaces";');
            fs.writeFile(exampleFilePath, stringResult, 'utf8', function (err) {
                if (err)
                    return console.log(err);
            });
        });
    }
}
copyFiles();
changeImports();
