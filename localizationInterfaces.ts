import { Language } from "~resource/languages";

// all tooltips
export interface LocalizationData {
    General: GeneralLocalization,
    Abilities: AbilityLocalization,
    Modifiers: ModifierLocalization,
}

// tooltips for abilities
export interface AbilityLocalization {
    [classname: string]: string | AbilityLocalizationBlock;
}

// tooltips for modifiers
export interface ModifierLocalization {
    [classname:string]: string | ModifierLocalizationBlock;
}

// tooltips for anything
export interface GeneralLocalization {
    [classname:string]: string | GeneralLocalizationBlock;
}

// tooltips with language overrides
export interface AbilityLocalizationBlock extends AbilityLocalizationInfo, LanguageOverrides<AbilityLocalizationInfo> {}
export interface ModifierLocalizationBlock extends ModifierLocalizationInfo, LanguageOverrides<ModifierLocalizationInfo> {}
export interface GeneralLocalizationBlock extends GeneralLocalizationInfo, LanguageOverrides<GeneralLocalizationInfo> {}


// ability tooltip
export interface AbilityLocalizationInfo {
    name?: string;
    description?: string;
    scepter?: string;
    shard?: string;
    lore?: string;
    notes?: Array<string>;
    specials?: AbilitySpecialValues;
}

// modifier tooltip
export interface ModifierLocalizationInfo {
    name?: string;
    description?: string;
}

// general tooltip
export interface GeneralLocalizationInfo { 
    name: string 
}

// language overrides
// maybe change to dictionary {language -> T | string}
export interface LanguageOverrides<T> { 
    language_overrides?: Array<T & LanguageOverride> 
}

// overrides one language
export interface LanguageOverride {
    language: Language
}

export interface AbilitySpecialValues {
    [key: string]: string | AbilitySpecialValue
}


// abilits special value
export interface AbilitySpecialValue {
    name: string;
    percentage?: boolean;
    item_stat?: boolean;
}