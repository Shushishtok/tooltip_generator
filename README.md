# Dota 2 Custom Game Tooltip Generator
A utility that converts Typescript code to localization that Dota 2 custom games can use.

# That's Typescript. Can it work with lua addons?
Yes! The code is typescript, but it doesn't force the entire project to be typescript as well.

# What do I need to use this repo?
In order to make Typescript compile at all, [NodeJS](https://nodejs.org/en/) must be installed on your system. Install the latest stable version shown in the link.
I heavily recommend using VSCode, not only because of its internal support of NodeJS, but also because it's a great editor. Also, not all editors support NodeJS and/or Typescript, which, depending on the editor, will make it inconvenient to work with the tooltip generator.

# Installation Instructions
* Install NodeJS
* Put fsWatcher.ts, fsWatcher.js, and package.json in project root
* Put all resource files in /resource, where addon_english.txt resides
* If necessary, change all /game/resource/ paths to /resource in `package.json` and in fsWatcher.ts.
* Run "npm install" on project root
* Run "npx tsc .\fsWatcher.ts" on project root
* Navigate to your resource folder with "cd game/resource" or "cd /resource"
* Run "npx tsc"
* Run build task: CTRL+SHIFT+B on VSCode.
* Test: in the resource folder, go to /localization, open localizationData.ts, change one or more characters in the localization, and save: the terminal should show updates, and addon_english should update.
