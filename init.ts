import * as fs from 'fs';

function copyFiles() {
	console.log("Copying initial files...");
	const resourcePath = "node_modules/~resource";
	let filePath = __dirname + "/tsconfig.json";
	if (fs.existsSync(resourcePath)) 
	{
		console.log(`Checking if tsconfig.json exists in ${filePath}`)
		if (fs.existsSync(filePath))
		{
			console.log("tsconfig.json found!")
			let resultPath = resourcePath + "/tsconfig.json";
			fs.copyFileSync(filePath, resultPath);		
			console.log(`tsconfig.json copied to ${resultPath} folder`);
		}
		filePath = __dirname + "/ModifierProperties.d.ts";
		console.log(`Checking if ModifierProperties.d.ts exists in ${filePath}`)
		if (fs.existsSync(filePath))
		{
			console.log("ModifierProperties.d.ts found!")
			let resultPath = resourcePath + "/ModifierProperties.d.ts"		
			fs.copyFileSync(filePath, resultPath);
			console.log(`ModifierProperties.d.ts copied to ${resultPath} folder`);
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
		console.log(`Checking if localizationData example files exist in folder`);
		if (!fs.existsSync(resultPath + "/localizationData.ts")) 
		{
			fs.copyFileSync(dirPath + "/localizationData.ts", resultPath + "/localizationData.ts");
			console.log(`localizationData example files do not exist: created at ${resultPath}`)
		}
		if (!fs.existsSync(resultPath + "/localizationData.js")) 
		{
			fs.copyFileSync(dirPath + "/localizationData.js", resultPath + "/localizationData.js");
		}
	}
	console.log("\x1b[36m%s\x1b[0m", "Finished copy process!");
}

copyFiles();