# Dota 2 Custom Game Tooltip Generator
A utility that converts Typescript code to localization that Dota 2 custom games can use.

# That's Typescript. Can it work with lua addons?
Yes! The code is typescript, but it doesn't force the entire project to be typescript as well.

# What do I need to use this repo?
In order to make Typescript compile at all, [NodeJS](https://nodejs.org/en/) must be installed on your system. Install the latest stable version shown in the link.
I heavily recommend using VSCode, not only because of its internal support of NodeJS, but also because it's a great editor. Also, not all editors support NodeJS and/or Typescript, which, depending on the editor, will make it inconvenient to work with the tooltip generator.

# Installation Instructions
* Install NodeJS.
* Put `fsWatcher.ts`, `fsWatcher.js`, and `package.json` in project root
* Put all resource files in /resource, where `addon_english.txt` resides
* If you have a symlink or a irregular addon build, change all `/resource` paths to reach the `resource` folder, where `addon_<language>.txt` files reside. Change those in the `package.json` and in the `fsWatcher.ts` files.
* Run `npm install` on project root.
* Run `npx tsc .\fsWatcher.ts` on project root. Note that it needs to be the `.ts` file, not the `.js` one.
* Navigate to your resource folder with `cd /resource`, or whichever path your `resource` folder is in.
* Run `npx tsc`.
* Run build task: `CTRL+SHIFT+B` on VSCode. If you're using Sublime follow the instructions below.
* Test: in the resource folder, go to `/localization`, open `localizationData.ts`, change one or more characters in the localization, and save. The terminal should show updates, and addon_english should update with that change.

# Running build task with Sublime:
Credits to Nibuja for this part.

Tools > Build System > New Build System...
```
{
    "shell_cmd": "npm run dev"
}
```

Save as any name like `dota_ts.sublime-build`
have `fsWatcher.ts` or `package.json` or any other file from the project open -> press Ctrl + Shift + B -> select `dota_ts` -> console opens and it is run, is closed with esc, will still continue to compile everything until sublime is closed.
