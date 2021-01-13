import * as fs from 'fs';
import { LocalizationCompiler } from './localizationCompiler';
import { LocalizationData} from './localizationInterfaces';
const watch = require("node-watch");

let completeData: {[path: string]: LocalizationData} = {};
const resourcePath = "node_modules/~resource";
const generatorPath = "node_modules/~generator";

console.log(fs.realpathSync(generatorPath));

let watcher = watch([resourcePath + "/localization", generatorPath + "/localizationCompiler.js"], {recursive: true})
watcher.on("change", (eventType ?: 'update' | 'remove' | undefined, filePath ?: string) => {
	if (!filePath) return;
	if (filePath.includes("localizationCompiler.js")) {
		compiler = loadCompiler();
	}
	let match = /(node_modules[\\/])?(.*[\/|\\](\w+)).js/g.exec(filePath);
	if (eventType == "update" && filePath && match) {
		const curpath = match[2];
		const data = getDataFromFile(curpath + ".js");
		if (data) {
			completeData[curpath] = data;
			combineData();
		}
	} else if (eventType == "remove" && match) {
		if (completeData.hasOwnProperty(match[2])) {
			delete completeData[match[2]];
			combineData();
		}
	}
})

// not really neccessarry:
watcher.on("error", (error: Error) => {
	console.log("\x1b[31m%s\x1b[0m", "Something went wrong!");
	console.log(error);
})

watcher.on("ready", () => {
	console.log("\x1b[32m%s\x1b[0m", "Ready!");
})

let compiler = loadCompiler();

function getDataFromFile(filePath: string): LocalizationData | undefined {
	if (!fs.existsSync("node_modules/" + filePath)){
		return;
	}
	delete require.cache[require.resolve(filePath)]
	let file = require(filePath);
	if (file["GenerateLocalizationData"]) {
		const localizationArr: LocalizationData = file["GenerateLocalizationData"]();
		return localizationArr;
	}
	return;
}

function combineData() {
	compiler.OnLocalizationDataChanged(completeData);
}

function loadCompiler(): LocalizationCompiler
{
    // Clear require cache
    delete require.cache[require.resolve("~generator/localizationCompiler")]
    // Require latest compiler version
    const compilerClass: new () => LocalizationCompiler = require("~generator/localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}
