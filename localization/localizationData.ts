import { Language } from "../languages";
import { AbilityLocalization, LocalizationData, ModifierLocalization, GeneralLocalization } from "../localizationInterfaces";

export function GenerateLocalizationData({Abilities, Modifiers, General}: LocalizationData): void {
    Abilities["Hello_World"] = "Test Ability";

    General["addon_game_name"] = "Tooltip Testing";

    Modifiers["modifier_generic_testing"] = {
        name: "Generic Testing",
        description: "This is a modifier block test.",
        language_overrides: [
            {
                language: Language.Russian,
                description: "THIS IS A HUGE RUSSIAN TEXT."
            }
            
        ]
    }
}
