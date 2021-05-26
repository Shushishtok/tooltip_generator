import * as fs from 'fs';

function copyFiles() {
	console.log("Copying initial files...");
	const resourcePath = "node_modules/~resource";
	let filePath = __dirname + "/tsconfig.json";
	if (fs.existsSync(resourcePath))
	{
		filePath = __dirname + "/tsconfig.json";
		console.log(`Checking if tsconfig.json exists in ${filePath}`)
		if (fs.existsSync(filePath))
		{
			console.log("tsconfig.json found!");
		} else {
			let resultPath = resourcePath + "/tsconfig.json";
			fs.copyFileSync(filePath, resultPath);		
			console.log(`Not found, tsconfig.json copied to ${resultPath} folder`);
		}
		filePath = __dirname + "/ModifierProperties.d.ts";
		console.log(`Checking if ModifierProperties.d.ts exists in ${filePath}`)
		if (fs.existsSync(filePath))
		{
			console.log("ModifierProperties.d.ts found!");
		} else {
			let resultPath = resourcePath + "/ModifierProperties.d.ts"		
			fs.copyFileSync(filePath, resultPath);
			console.log(`Not found, ModifierProperties.d.ts copied to ${resultPath} folder`);
		}
		filePath = __dirname + "/languages.ts"
		console.log(`Checking if languages.ts exsts in ${filePath}`)
		if (fs.existsSync(filePath))
		{
			console.log("languages.ts found!");
		} else {
			let resultPath = resourcePath + "/languages.ts"
			fs.copyFileSync(filePath, resultPath);
			console.log(`Not found, languages.ts copied to ${resultPath} folder`);
		}
		filePath = __dirname + "/languages.js"
		console.log(`Checking if languages.js exsts in ${filePath}`)
		if (fs.existsSync(filePath))
		{
			console.log("languages.js found!");
		} else {
			let resultPath = resourcePath + "/languages.js"
			fs.copyFileSync(filePath, resultPath);
			console.log(`Not found, languages.js copied to ${resultPath} folder`);
		}
	}

	let dirPath = __dirname + "/localization";
	if (fs.existsSync(filePath) && fs.existsSync(resourcePath))
	{
		let resultPath = resourcePath + "/localization";
		console.log(`Checking if localization folder exists in ${resultPath}`);
		if (!fs.existsSync(resultPath))
		{
			fs.mkdirSync(resultPath);
			console.log("localization folder not found, creating the folder.")
		}
		console.log(`Checking if localization folder is empty`);
		if (fs.readdirSync(resultPath).length === 0) {
			console.log(`Localization folder is empty, copying example files.`);
			if (!fs.existsSync(resultPath + "/localizationData.ts")) 
			{
				fs.copyFileSync(dirPath + "/localizationData.ts", resultPath + "/localizationData.ts");
			}
			if (!fs.existsSync(resultPath + "/localizationData.js")) 
			{
				fs.copyFileSync(dirPath + "/localizationData.js", resultPath + "/localizationData.js");
			}
		}
	}
	console.log("\x1b[36m%s\x1b[0m", "Finished copy process!");
}

function changeImports()
{
	const resourcePath = "node_modules/~resource";
	const compilerFilePath = __dirname + "/localizationCompiler.ts";

	if (fs.existsSync(compilerFilePath))
	{
		fs.readFile(compilerFilePath, 'utf8' ,(err, data) =>
		{
			if (err) {return console.log(err)}
			const result = data.replace('import { Language } from "./languages"', 'import { Language } from "~resource/languages"')

			fs.writeFile(compilerFilePath, result, 'utf8', function (err) {
				if (err) return console.log(err);
			 });
		})
	}

	const compilerJSFilePath = __dirname + "/localizationCompiler.js";

	if (fs.existsSync(compilerJSFilePath))
	{
		fs.readFile(compilerJSFilePath, 'utf8' ,(err, data) =>
		{
			if (err) {return console.log(err)}
			const result = data.replace('languages_1 = require("./languages");', 'languages_1 = require("~resource/languages");')

			fs.writeFile(compilerJSFilePath, result, 'utf8', function (err) {
				if (err) return console.log(err);
			 });
		})
	}

	const interfacesFilePath = __dirname + "/localizationInterfaces.ts";
	
	if (fs.existsSync(interfacesFilePath))
	{
		fs.readFile(interfacesFilePath, 'utf8' ,(err, data) =>
		{
			if (err) {return console.log(err)}
			const stringResult = data.replace('import { Language } from "./languages"', 'import { Language } from "~resource/languages"')

			fs.writeFile(interfacesFilePath, stringResult, 'utf8', function (err) {
				if (err) return console.log(err);
			});
		})
	}

	const exampleFilePath = resourcePath + "/localization/localizationData.ts"

	if (fs.existsSync(exampleFilePath))
	{
		fs.readFile(exampleFilePath, 'utf8' ,(err, data) =>
		{
			if (err) {return console.log(err)}
			const stringResult = data.replace('import { AbilityLocalization, LocalizationData, ModifierLocalization, StandardLocalization } from "../localizationInterfaces";',
											  'import { AbilityLocalization, LocalizationData, ModifierLocalization, StandardLocalization } from "~generator/localizationInterfaces";')

			fs.writeFile(exampleFilePath, stringResult, 'utf8', function (err) {
				if (err) return console.log(err);
			});
		})
	}	
}

copyFiles();
changeImports();
