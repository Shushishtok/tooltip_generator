"use strict";
exports.__esModule = true;
exports.GenerateLocalizationData = void 0;
var languages_1 = require("../languages");
function GenerateLocalizationData(_a) {
    var Abilities = _a.Abilities, Modifiers = _a.Modifiers, General = _a.General;
    Abilities["Hello_World"] = "Test Ability";
    General["addon_game_name"] = "Tooltip Testing";
    Modifiers["modifier_generic_testing"] = {
        name: "Generic Testing",
        description: "This is a modifier block test.",
        language_overrides: [
            {
                language: languages_1.Language.Russian,
                description: "THIS IS A HUGE RUSSIAN TEXT."
            }
        ]
    };
}
exports.GenerateLocalizationData = GenerateLocalizationData;
