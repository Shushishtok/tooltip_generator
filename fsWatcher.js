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
var watch = require("node-watch");
var completeData = {};
var resourcePath = "node_modules/~resource";
var generatorPath = "node_modules/~generator";
console.log(fs.realpathSync(generatorPath));
var watcher = watch([resourcePath + "/localization", generatorPath + "/localizationCompiler.js"], { recursive: true });
watcher.on("change", function (eventType, filePath) {
    if (!filePath)
        return;
    if (filePath.includes("localizationCompiler.js")) {
        compiler = loadCompiler();
    }
    var match = /(node_modules[\\/])?(.*[\/|\\](\w+)).js/g.exec(filePath);
    if (eventType == "update" && filePath && match) {
        var curpath = match[2];
        var data = getDataFromFile(curpath + ".js");
        if (data) {
            completeData[curpath] = data;
            combineData();
        }
    }
    else if (eventType == "remove" && match) {
        if (completeData.hasOwnProperty(match[2])) {
            delete completeData[match[2]];
            combineData();
        }
    }
});
// not really neccessarry:
watcher.on("error", function (error) {
    console.log("\x1b[31m%s\x1b[0m", "Something went wrong!");
    console.log(error);
});
watcher.on("ready", function () {
    console.log("\x1b[32m%s\x1b[0m", "Ready!");
});
var compiler = loadCompiler();
function getDataFromFile(filePath) {
    if (!fs.existsSync("node_modules/" + filePath)) {
        return;
    }
    delete require.cache[require.resolve(filePath)];
    var file = require(filePath);
    if (file["GenerateLocalizationData"]) {
        var localizationArr = file["GenerateLocalizationData"]();
        return localizationArr;
    }
    return;
}
function combineData() {
    compiler.OnLocalizationDataChanged(completeData);
}
function loadCompiler() {
    // Clear require cache
    delete require.cache[require.resolve("~generator/localizationCompiler")];
    // Require latest compiler version
    var compilerClass = require("~generator/localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}
