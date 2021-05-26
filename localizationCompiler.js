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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizationCompiler = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var valve_kv_1 = require("valve-kv");
var languages_1 = require("./languages");
var LocalizationCompiler = /** @class */ (function () {
    function LocalizationCompiler() {
        this.addon_filepath = path.join("node_modules/~resource", "addon_");
        this.filepath_format = ".txt";
        this.currentWrites = new Set();
    }
    // Helper functions
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
        var e_1, _a, e_2, _b;
        // console.log("Localization event fired");
        var Abilities = new Array();
        var Modifiers = new Array();
        var StandardTooltips = new Array();
        //let Talents: Array<HeroTalents> = new Array<HeroTalents>();
        var localization_info = {
            AbilityArray: Abilities,
            ModifierArray: Modifiers,
            StandardArray: StandardTooltips,
        };
        try {
            for (var _c = __values(Object.entries(allData)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], data = _e[1];
                if (data.AbilityArray) {
                    Array.prototype.push.apply(Abilities, data.AbilityArray);
                }
                if (data.ModifierArray) {
                    Array.prototype.push.apply(Modifiers, data.ModifierArray);
                }
                if (data.StandardArray) {
                    Array.prototype.push.apply(StandardTooltips, data.StandardArray);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Generate information for every language
        var languages = Object.values(languages_1.Language).filter(function (v) { return typeof v !== "number"; });
        try {
            for (var languages_2 = __values(languages), languages_2_1 = languages_2.next(); !languages_2_1.done; languages_2_1 = languages_2.next()) {
                var language = languages_2_1.value;
                if (language != languages_1.Language.None) {
                    var tokens = this.GenerateContentStringForLanguage(language, localization_info);
                    this.WriteContentToAddonFile(language, tokens);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (languages_2_1 && !languages_2_1.done && (_b = languages_2.return)) _b.call(languages_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    LocalizationCompiler.prototype.GenerateContentStringForLanguage = function (language, localized_data) {
        var e_3, _a, e_4, _b, e_5, _c, e_6, _d, e_7, _e, e_8, _f, e_9, _g, e_10, _h;
        var tokens = {};
        // Go over standard tooltips
        if (localized_data.StandardArray) {
            try {
                for (var _j = __values(localized_data.StandardArray), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var standardLocalization = _k.value;
                    // Check for name override for the language we're checking
                    var standard_tooltip_string = standardLocalization.name;
                    if (standardLocalization.language_overrides && standardLocalization.language_overrides.length > 0) {
                        try {
                            for (var _l = (e_4 = void 0, __values(standardLocalization.language_overrides)), _m = _l.next(); !_m.done; _m = _l.next()) {
                                var language_override = _m.value;
                                if (language_override.language === language) {
                                    standard_tooltip_string = language_override.name_override;
                                }
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_m && !_m.done && (_b = _l.return)) _b.call(_l);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                    tokens[standardLocalization.classname] = standard_tooltip_string;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_a = _j.return)) _a.call(_j);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        // Go over abilities for this language
        if (localized_data.AbilityArray) {
            try {
                for (var _o = __values(localized_data.AbilityArray), _p = _o.next(); !_p.done; _p = _o.next()) {
                    var ability = _p.value;
                    // Class name is identical for all languages, so we would always use it
                    var ability_string = "DOTA_Tooltip_Ability_" + ability.ability_classname;
                    // Name
                    var ability_name = ability.name;
                    var ability_description = ability.description;
                    //let reimagined_effects = ability.reimagined_effects;
                    var ability_lore = ability.lore;
                    var ability_notes = ability.notes;
                    var scepter_description = ability.scepter_description;
                    var shard_description = ability.shard_description;
                    var ability_specials = ability.ability_specials;
                    if (ability.language_overrides) {
                        try {
                            for (var _q = (e_6 = void 0, __values(ability.language_overrides)), _r = _q.next(); !_r.done; _r = _q.next()) {
                                var language_override = _r.value;
                                if (language_override.language === language) {
                                    // Check for name override
                                    if (language_override.name_override) {
                                        ability_name = language_override.name_override;
                                    }
                                    // Check for description overrides
                                    if (language_override.description_override) {
                                        ability_description = language_override.description_override;
                                    }
                                    // Check for reimagined effect overrides
                                    //if (language_override.reimagined_effects_override)
                                    //{
                                    //reimagined_effects = language_override.reimagined_effects_override;
                                    //}
                                    // Check for lore override
                                    if (language_override.lore_override) {
                                        ability_lore = language_override.lore_override;
                                    }
                                    // Check for note override
                                    if (language_override.notes_override) {
                                        ability_notes = language_override.notes_override;
                                    }
                                    // Check for scepter override
                                    if (language_override.scepter_description_override) {
                                        scepter_description = language_override.scepter_description_override;
                                    }
                                    // Check for shard override
                                    if (language_override.shard_description_override) {
                                        shard_description = language_override.shard_description_override;
                                    }
                                    // Check for ability specials override, if any
                                    if (language_override.ability_specials_override) {
                                        ability_specials = language_override.ability_specials_override;
                                    }
                                }
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_r && !_r.done && (_d = _q.return)) _d.call(_q);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                    }
                    // Add name localization
                    if (ability_name) {
                        tokens[ability_string] = ability_name;
                    }
                    // Add description localization
                    if (ability_description) {
                        ability_description = this.TransformForLocalization(ability_description, false);
                        tokens[ability_string + "_description"] = ability_description;
                    }
                    // Lore, if any
                    if (ability_lore) {
                        var transformed_lore = this.TransformForLocalization(ability_lore, false);
                        tokens[ability_string + "_Lore"] = transformed_lore;
                    }
                    // Notes, if any
                    if (ability_notes) {
                        var counter = 0;
                        try {
                            for (var ability_notes_1 = (e_7 = void 0, __values(ability_notes)), ability_notes_1_1 = ability_notes_1.next(); !ability_notes_1_1.done; ability_notes_1_1 = ability_notes_1.next()) {
                                var note = ability_notes_1_1.value;
                                var transformed_note = this.TransformForLocalization(note, false);
                                tokens[ability_string + "_Note" + counter] = transformed_note;
                                counter++;
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (ability_notes_1_1 && !ability_notes_1_1.done && (_e = ability_notes_1.return)) _e.call(ability_notes_1);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                    }
                    // Scepter, if any
                    if (scepter_description) {
                        var ability_scepter_description = this.TransformForLocalization(scepter_description, false);
                        tokens[ability_string + "_scepter_description"] = ability_scepter_description;
                    }
                    // Shard, if any
                    if (shard_description) {
                        var ability_shard_description = this.TransformForLocalization(shard_description, false);
                        tokens[ability_string + "_shard_description"] = ability_shard_description;
                    }
                    // Ability specials, if any
                    if (ability_specials) {
                        try {
                            for (var ability_specials_1 = (e_8 = void 0, __values(ability_specials)), ability_specials_1_1 = ability_specials_1.next(); !ability_specials_1_1.done; ability_specials_1_1 = ability_specials_1.next()) {
                                var ability_special = ability_specials_1_1.value;
                                // Construct the ability special
                                var ability_special_text = "";
                                if (ability_special.percentage) {
                                    ability_special_text = "%";
                                }
                                else if (ability_special.item_stat) {
                                    ability_special_text = "+$";
                                }
                                ability_special_text += ability_special.text;
                                tokens[ability_string + "_" + ability_special.ability_special] = ability_special_text;
                            }
                        }
                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                        finally {
                            try {
                                if (ability_specials_1_1 && !ability_specials_1_1.done && (_f = ability_specials_1.return)) _f.call(ability_specials_1);
                            }
                            finally { if (e_8) throw e_8.error; }
                        }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_p && !_p.done && (_c = _o.return)) _c.call(_o);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        // Go over modifiers
        if (localized_data.ModifierArray) {
            try {
                for (var _s = __values(localized_data.ModifierArray), _t = _s.next(); !_t.done; _t = _s.next()) {
                    var modifier = _t.value;
                    var modifier_string = "DOTA_Tooltip_" + modifier.modifier_classname;
                    // Name
                    var modifier_name = modifier.name;
                    var modifier_description = modifier.description;
                    if (modifier.language_overrides) {
                        try {
                            for (var _u = (e_10 = void 0, __values(modifier.language_overrides)), _v = _u.next(); !_v.done; _v = _u.next()) {
                                var language_override = _v.value;
                                if (language_override.language === language) {
                                    // Name overrides for a specific language, if necessary
                                    if (language_override.name_override) {
                                        modifier_name = language_override.name_override;
                                    }
                                    // Description overrides for a specific language, if necessary
                                    if (language_override.description_override) {
                                        modifier_description = language_override.description_override;
                                    }
                                }
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (_v && !_v.done && (_h = _u.return)) _h.call(_u);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                    }
                    // Add name to localization string
                    if (modifier_name) {
                        tokens[modifier_string] = modifier_name;
                    }
                    // Add description to localization string
                    if (modifier_description) {
                        modifier_description = this.TransformForLocalization(modifier_description, true);
                        tokens[modifier_string + "_description"] = modifier_description;
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_g = _s.return)) _g.call(_s);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
        return tokens;
    };
    LocalizationCompiler.prototype.WriteContentToAddonFile = function (language, tokens) {
        var _this = this;
        // Set based on language
        var filepath = this.addon_filepath + language.toString() + this.filepath_format;
        // Remove file contents, or create a fresh one if it doesn't exists yet.
        var fd = fs.openSync(filepath, 'w');
        fs.closeSync(fd);
        // Add the opening tokens        
        var kv = { lang: { Language: language, Tokens: tokens } };
        // Serialize!        
        var write_string = valve_kv_1.serialize(kv);
        // Write to the file
        fs.writeFileSync(filepath, write_string);
        // Prepare the output
        this.currentWrites.add(language);
        if (this.writeTimeout) {
            clearTimeout(this.writeTimeout);
        }
        this.writeTimeout = setTimeout(function () { return _this.FinishWrite(); }, 500);
    };
    // Print the output
    LocalizationCompiler.prototype.FinishWrite = function () {
        var e_11, _a;
        if (this.currentWrites.size === 0)
            return;
        var languages = [];
        try {
            for (var _b = __values(this.currentWrites.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var language = _c.value;
                languages.push(language);
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
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
