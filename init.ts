import * as fs from 'fs';

function copyFiles() {
	console.log("Copying initial files...");
	const resourcePath = "node_modules/~resource";
	let filePath = __dirname + "/tsconfig.json";
	if (fs.existsSync(filePath) && fs.existsSync(resourcePath)) {
		let resultPath = resourcePath + "/tsconfig.json";
		fs.copyFileSync(filePath, resultPath);
		resultPath = resourcePath + "/ModifierProperties.d.ts"
		fs.copyFileSync(filePath, resultPath);
	}
	let dirPath = __dirname + "/localization";
	if (fs.existsSync(filePath) && fs.existsSync(resourcePath)) {
		let resultPath = resourcePath + "/localization";
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