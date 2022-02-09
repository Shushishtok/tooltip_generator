import * as fs from 'fs';
import * as path from 'path'
import { KVObject, serialize } from 'valve-kv'
import { AbilitySpecialValues , GeneralLocalizationBlock, GeneralLocalizationInfo, LanguageOverride, LanguageOverrides, LocalizationData } from './localizationInterfaces';
import { Language } from "~resource/languages";

export class LocalizationCompiler {
    addon_filepath: string = path.join("node_modules/~resource", "addon_");
    filepath_format: string = ".txt";
    currentWrites: Set<string> = new Set();
    writeTimeout?: NodeJS.Timeout;
    
    TransformForLocalization(text: string, modifier: boolean): string {
        if (modifier) {
            text = text.replace(/\{([^f]\w+)\}($|[^%])/g, "%d$1%$2")
            text = text.replace(/\{([^f]\w+)\}%/g, "%d$1%%%")
            text = text.replace(/\{f(\w+)\}($|[^%])/g, "%f$1%$2")
            text = text.replace(/\{f(\w+)\}%/g, "%f$1%%%");
            text = text.replace(/%\{([^f]\w+)\}/g, "%%%d$1%")
            text = text.replace(/%\{f(\w+)\}/g, "%%%f$1%");

            return text;
        } else {
            text = text.replace(/\{(\w*)}($|[^%])/g, "%$1%$2")
            text = text.replace(/\{(\w*)}%/g, "%$1%%%");
            text = text.replace(/%\{(\w*)}/g, "%%%$1%");
            
            return text;
        }
    }
    
    OnLocalizationDataChanged(allData: {[path: string]: LocalizationData}) {
        const localizedData: LocalizationData = {
            General  : {},
            Abilities : {},
            Modifiers : {},
        };
        
        for (const data of Object.values(allData)) {
            Object.entries(data.General).forEach(s=>localizedData.General[s[0]] = s[1]);
            Object.entries(data.Abilities).forEach(a=>localizedData.Abilities[a[0]] = a[1])
            Object.entries(data.Modifiers).forEach(m=>localizedData.Modifiers[m[0]] = m[1]);
        }
        
        for (const language of Object.values(Language)) {
            if (language != Language.None) {
                const tokens = this.GenerateContentStringForLanguage(language, localizedData);
                this.WriteContentToAddonFile(language, tokens);
            }
        }
    }
    
    FindValue(block: any, key: string, language: Language): any | undefined {
        if (block.language_overrides) {
            const language_overrides = block.language_overrides as Array<LanguageOverride & any>;
            for (const language_override of language_overrides) {
                if (language_override.language === language) {
                    if (language_override[key]) return language_override[key];
                    break;
                }
            }
        }
        return block[key];
    }
    
    GenerateContentStringForLanguage(language: Language, localizedData: LocalizationData): KVObject {
        const tokens: KVObject = {};
        for (const entry of Object.entries(localizedData.General)) {
            const classname = entry[0];
            const block = entry[1];
            if (typeof block == "string") {
                tokens[classname]  = block;
            } else {
                tokens[classname] = this.FindValue(block, "name", language)!;
            }
        }
        
        for (const entry of Object.entries(localizedData.Abilities)) {
            const classname = "DOTA_TOOLTIP_ABILITY_" + entry[0]
            const block = entry[1];
            if (typeof block == "string") {
                tokens[classname] = block;
            } else {
                const name = this.FindValue(block, "name", language);
                if (name) tokens[classname] = name;
                
                const description = this.FindValue(block, "description", language);
                if (description) tokens[classname + "_description"] = description;
                
                const scepter = this.FindValue(block, "scepter", language);
                if (scepter) tokens[classname + "_scepter_description"] = scepter;
                
                const shard = this.FindValue(block, "shard", language);
                if (shard) tokens[classname + "_shard_description"] = shard;
                
                const lore = this.FindValue(block, "lore", language);
                if (lore) tokens[classname + "_lore"] = lore;
                
                const notes: Array<string> = this.FindValue(block, "notes", language);
                if (notes) {
                    for (let i = 0; i<notes.length; i++) {
                        tokens[classname + "_Note" + i] = notes[i];
                    }
                }
                
                const specials: AbilitySpecialValues = this.FindValue(block, "specials", language);
                if (specials) {
                    for (const special of Object.entries(specials)) {
                        if (typeof special[1] == "string") {
                            tokens[classname + "_" + special[0]] = special[1];
                        } else {
                            let text = "";
                            if (special[1].percentage) {
                                text = "%";
                            } else if (special[1].item_stat) {
                                text = "+$"
                            }
                            text += special[1].name;
                            tokens[classname + "_" + special[0]] = text;
                        }
                    }
                }
            }
        }
        
        for (const entry of Object.entries(localizedData.Modifiers)) {
            const classname = "DOTA_TOOLTIP_" + entry[0];
            const block = entry[1];
            if (typeof block == "string") {
                tokens[classname] = block;
            } else {
                const name = this.FindValue(block, "name", language);
                if (name) tokens[classname] = name;
                
                const description = this.FindValue(block, "description", language);
                if (description) tokens[classname + "_description"] = description;
            }
        }
        return tokens;
    }
    
    WriteContentToAddonFile(language: string, tokens: KVObject): void {
        // Set based on language
        const filepath = this.addon_filepath + language.toString() + this.filepath_format;

        // Add the opening tokens        
        const kv = {lang: { Language: language, Tokens: tokens}}

        // Serialize!        
        let write_string = serialize(kv);

        // Try writing if the output is not busy
        this.TryWriting(filepath, write_string, () => {

            // Prepare the output
            this.currentWrites.add(language);
            if (this.writeTimeout) {
                clearTimeout(this.writeTimeout);
            }
            this.writeTimeout = setTimeout(() => this.FinishWrite(), 500);
        });
    }
    
    TryWriting(filepath: string, write_string: string, success: () => void, tries: number = 0): void {
        if (tries > 5) {
            console.log("\x1b[31m%s\x1b[0m", "Tried too many times to write without success!");
            return;
        }
        try {
            // Remove file contents, or create a fresh one if it doesn't exists yet.
            const fd = fs.openSync(filepath, 'w');
            fs.closeSync(fd);

            // Write to the file
            fs.writeFileSync(filepath, write_string);
        } catch {
            // try again after a short time
            setTimeout(() => this.TryWriting(filepath, write_string, success, tries + 1), 1000);
            return;
        }
        success();
    }
    
    FinishWrite(): void {
        if (this.currentWrites.size === 0) return;
        let languages: string[] = [];
        for (const language of Object.values(this.currentWrites)) {
            languages.push(language);
        }
        this.currentWrites.clear();
        let languageText = languages[0];
        if (languages.length > 1) {
            let lastLang = languages.splice(-1)[0];
            let otherLangs = languages.join(", ");
            if (otherLangs !== "") {
                languageText = otherLangs;
            }
            languageText += " and " + lastLang;
        }
        console.log(`Finished writing tooltips for ${languageText}`);
        console.log("");
    }
}