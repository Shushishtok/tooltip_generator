"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateLocalizationData = void 0;
function GenerateLocalizationData() {
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    var Abilities = new Array();
    var Modifiers = new Array();
    var StandardTooltips = new Array();
    // Create object of arrays
    var localization_info = {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,
    };
    //#endregion
    // Enter localization data below! Currently this is empty and technically there's no point for this file, but it was where everything started and I can't bring myself to delete it
    StandardTooltips.push({
        classname: "Hello",
        name: "test"
    });
    // Return data to compiler
    return localization_info;
}
exports.GenerateLocalizationData = GenerateLocalizationData;
