"use strict";
exports.__esModule = true;
exports.LocalizationCompiler = void 0;
var fs = require("fs");
var path = require("path");
var valve_kv_1 = require("valve-kv");
var languages_1 = require("~resource/languages");
var LocalizationCompiler = /** @class */ (function () {
    function LocalizationCompiler() {
        this.addon_filepath = path.join("node_modules/~resource", "addon_");
        this.filepath_format = ".txt";
        this.currentWrites = new Set();
    }
    LocalizationCompiler.prototype.TransformForLocalization = function (text, modifier) {
        if (modifier) {
            text = text.replace(/\{([^f]\w+)\}($|[^%])/g, "%d$1%$2");
            text = text.replace(/\{([^f]\w+)\}%/g, "%d$1%%%");
            text = text.replace(/\{f(\w+)\}($|[^%])/g, "%f$1%$2");
            text = text.replace(/\{f(\w+)\}%/g, "%f$1%%%");
            text = text.replace(/%\{([^f]\w+)\}/g, "%%%d$1%");
            text = text.replace(/%\{f(\w+)\}/g, "%%%f$1%");
            return text;
        }
        else {
            text = text.replace(/\{(\w*)}($|[^%])/g, "%$1%$2");
            text = text.replace(/\{(\w*)}%/g, "%$1%%%");
            text = text.replace(/%\{(\w*)}/g, "%%%$1%");
            return text;
        }
    };
    LocalizationCompiler.prototype.OnLocalizationDataChanged = function (allData) {
        var localizedData = {
            General: {},
            Abilities: {},
            Modifiers: {}
        };
        for (var _i = 0, _a = Object.values(allData); _i < _a.length; _i++) {
            var data = _a[_i];
            Object.entries(data.General).forEach(function (s) { return localizedData.General[s[0]] = s[1]; });
            Object.entries(data.Abilities).forEach(function (a) { return localizedData.Abilities[a[0]] = a[1]; });
            Object.entries(data.Modifiers).forEach(function (m) { return localizedData.Modifiers[m[0]] = m[1]; });
        }
        for (var _b = 0, _c = Object.values(languages_1.Language); _b < _c.length; _b++) {
            var language = _c[_b];
            if (language != languages_1.Language.None) {
                var tokens = this.GenerateContentStringForLanguage(language, localizedData);
                this.WriteContentToAddonFile(language, tokens);
            }
        }
    };
    LocalizationCompiler.prototype.FindValue = function (block, key, language) {
        if (block.language_overrides) {
            var language_overrides = block.language_overrides;
            for (var _i = 0, language_overrides_1 = language_overrides; _i < language_overrides_1.length; _i++) {
                var language_override = language_overrides_1[_i];
                if (language_override.language === language) {
                    if (language_override[key])
                        return language_override[key];
                    break;
                }
            }
        }
        return block[key];
    };
    LocalizationCompiler.prototype.GenerateContentStringForLanguage = function (language, localizedData) {
        var tokens = {};
        for (var _i = 0, _a = Object.entries(localizedData.General); _i < _a.length; _i++) {
            var entry = _a[_i];
            var classname = entry[0];
            var block = entry[1];
            if (typeof block == "string") {
                tokens[classname] = block;
            }
            else {
                tokens[classname] = this.FindValue(block, "name", language);
            }
        }
        for (var _b = 0, _c = Object.entries(localizedData.Abilities); _b < _c.length; _b++) {
            var entry = _c[_b];
            var classname = "DOTA_TOOLTIP_ABILITY_" + entry[0];
            var block = entry[1];
            if (typeof block == "string") {
                tokens[classname] = block;
            }
            else {
                var name_1 = this.FindValue(block, "name", language);
                if (name_1)
                    tokens[classname] = name_1;
                var description = this.FindValue(block, "description", language);
                if (description)
                    tokens[classname + "_description"] = description;
                var scepter = this.FindValue(block, "scepter", language);
                if (scepter)
                    tokens[classname + "_scepter_description"] = scepter;
                var shard = this.FindValue(block, "shard", language);
                if (shard)
                    tokens[classname + "_shard_description"] = shard;
                var lore = this.FindValue(block, "lore", language);
                if (lore)
                    tokens[classname + "_lore"] = lore;
                var notes = this.FindValue(block, "notes", language);
                if (notes) {
                    for (var i = 0; i < notes.length; i++) {
                        tokens[classname + "_Note" + i] = notes[i];
                    }
                }
                var specials = this.FindValue(block, "specials", language);
                if (specials) {
                    for (var _d = 0, _e = Object.entries(specials); _d < _e.length; _d++) {
                        var special = _e[_d];
                        if (typeof special[1] == "string") {
                            tokens[classname + "_" + special[0]] = special[1];
                        }
                        else {
                            var text = "";
                            if (special[1].percentage) {
                                text = "%";
                            }
                            else if (special[1].item_stat) {
                                text = "+$";
                            }
                            text += special[1].name;
                            tokens[classname + "_" + special[0]] = text;
                        }
                    }
                }
            }
        }
        for (var _f = 0, _g = Object.entries(localizedData.Modifiers); _f < _g.length; _f++) {
            var entry = _g[_f];
            var classname = "DOTA_TOOLTIP_" + entry[0];
            var block = entry[1];
            if (typeof block == "string") {
                tokens[classname] = block;
            }
            else {
                var name_2 = this.FindValue(block, "name", language);
                if (name_2)
                    tokens[classname] = name_2;
                var description = this.FindValue(block, "description", language);
                if (description)
                    tokens[classname + "_description"] = description;
            }
        }
        return tokens;
    };
    LocalizationCompiler.prototype.WriteContentToAddonFile = function (language, tokens) {
        var _this = this;
        // Set based on language
        var filepath = this.addon_filepath + language.toString() + this.filepath_format;
        // Add the opening tokens        
        var kv = { lang: { Language: language, Tokens: tokens } };
        // Serialize!        
        var write_string = valve_kv_1.serialize(kv);
        // Try writing if the output is not busy
        this.TryWriting(filepath, write_string, function () {
            // Prepare the output
            _this.currentWrites.add(language);
            if (_this.writeTimeout) {
                clearTimeout(_this.writeTimeout);
            }
            _this.writeTimeout = setTimeout(function () { return _this.FinishWrite(); }, 500);
        });
    };
    LocalizationCompiler.prototype.TryWriting = function (filepath, write_string, success, tries) {
        var _this = this;
        if (tries === void 0) { tries = 0; }
        if (tries > 5) {
            console.log("\x1b[31m%s\x1b[0m", "Tried too many times to write without success!");
            return;
        }
        try {
            // Remove file contents, or create a fresh one if it doesn't exists yet.
            var fd = fs.openSync(filepath, 'w');
            fs.closeSync(fd);
            // Write to the file
            fs.writeFileSync(filepath, write_string);
        }
        catch (_a) {
            // try again after a short time
            setTimeout(function () { return _this.TryWriting(filepath, write_string, success, tries + 1); }, 1000);
            return;
        }
        success();
    };
    LocalizationCompiler.prototype.FinishWrite = function () {
        if (this.currentWrites.size === 0)
            return;
        var languages = [];
        for (var _i = 0, _a = Object.values(this.currentWrites); _i < _a.length; _i++) {
            var language = _a[_i];
            languages.push(language);
        }
        this.currentWrites.clear();
        var languageText = languages[0];
        if (languages.length > 1) {
            var lastLang = languages.splice(-1)[0];
            var otherLangs = languages.join(", ");
            if (otherLangs !== "") {
                languageText = otherLangs;
            }
            languageText += " and " + lastLang;
        }
        console.log("Finished writing tooltips for " + languageText);
        console.log("");
    };
    return LocalizationCompiler;
}());
exports.LocalizationCompiler = LocalizationCompiler;
