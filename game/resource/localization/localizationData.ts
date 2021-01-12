import { AbilityLocalization, Language, LocalizationData, ModifierLocalization, StandardLocalization } from "../localizationInterfaces";

export function GenerateLocalizationData(): LocalizationData
{
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    const Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();
    const Modifiers: Array<ModifierLocalization> = new Array<ModifierLocalization>();
    const StandardTooltips: Array<StandardLocalization> = new Array<StandardLocalization>();    

    // Create object of arrays
    const localization_info: LocalizationData =
    {
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
