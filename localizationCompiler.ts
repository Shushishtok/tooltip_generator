import * as fs from 'fs';
import * as path from 'path'
import { KVObject, serialize } from 'valve-kv'
import { LocalizationData, AbilityLocalization, ModifierLocalization, StandardLocalization } from "./localizationInterfaces";
import { Language } from "./languages"

export class LocalizationCompiler
{
	addon_filepath: string = path.join("node_modules/~resource", "addon_");
	filepath_format: string = ".txt";
	currentWrites: Set<string> = new Set();
	writeTimeout?: NodeJS.Timeout;

	// Helper functions
	TransformForLocalization(text: string, modifier: boolean): string
	{
		if (modifier)
		{
			text = text.replace(/\{([^f]\w+)\}($|[^%])/g, "%d$1%$2")
			text = text.replace(/\{([^f]\w+)\}%/g, "%d$1%%%")
			text = text.replace(/\{f(\w+)\}($|[^%])/g, "%f$1%$2")
			text = text.replace(/\{f(\w+)\}%/g, "%f$1%%%");
			text = text.replace(/%\{([^f]\w+)\}/g, "%%%d$1%")
			text = text.replace(/%\{f(\w+)\}/g, "%%%f$1%");

			return text;
		}
		else
		{
			text = text.replace(/\{(\w*)}($|[^%])/g, "%$1%$2")
			text = text.replace(/\{(\w*)}%/g, "%$1%%%");
			text = text.replace(/%\{(\w*)}/g, "%%%$1%");
			
			return text;
		}
	}

	OnLocalizationDataChanged(allData: {[path: string]: LocalizationData})
	{
		// console.log("Localization event fired");
		let Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();
		let Modifiers: Array<ModifierLocalization> = new Array<ModifierLocalization>();
		let StandardTooltips: Array<StandardLocalization> = new Array<StandardLocalization>();
		//let Talents: Array<HeroTalents> = new Array<HeroTalents>();

		const localization_info: LocalizationData =
		{
			AbilityArray: Abilities,
			ModifierArray: Modifiers,
			StandardArray: StandardTooltips,
			// TalentArray: Talents,
		};

		for (const [key, data] of Object.entries(allData)) {
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

		// Generate information for every language
		const languages = Object.values(Language).filter(v => typeof v !== "number");
		for (const language of languages)
		{            
			if (language != Language.None)
			{
				const tokens: KVObject = this.GenerateContentStringForLanguage(language, localization_info);
				this.WriteContentToAddonFile(language, tokens);
			}
		}
	}

	GenerateContentStringForLanguage(language: string, localized_data: LocalizationData): KVObject
	{
		let tokens: KVObject = {}

		// Go over standard tooltips
		if (localized_data.StandardArray) {
			for (const standardLocalization of localized_data.StandardArray)
			{
				// Check for name override for the language we're checking
				let standard_tooltip_string = standardLocalization.name;

				if (standardLocalization.language_overrides && standardLocalization.language_overrides.length > 0)
				{
					for (const language_override of standardLocalization.language_overrides)
					{
						if (language_override.language === language)
						{
							standard_tooltip_string = language_override.name_override;
						}
					}
				}

				tokens[standardLocalization.classname] = standard_tooltip_string;                
			}
		}

		// Go over abilities for this language
		if (localized_data.AbilityArray) {
			for (const ability of localized_data.AbilityArray)
			{
				// Class name is identical for all languages, so we would always use it
				const ability_string = `DOTA_Tooltip_Ability_${ability.ability_classname}`;

				// Name
				let ability_name = ability.name;
				let ability_description = ability.description;
				//let reimagined_effects = ability.reimagined_effects;
				let ability_lore = ability.lore;
				let ability_notes = ability.notes;
				let scepter_description = ability.scepter_description;
				let shard_description = ability.shard_description;
				let ability_specials = ability.ability_specials;

				if (ability.language_overrides)
				{
					for (const language_override of ability.language_overrides)
					{
						if (language_override.language === language)
						{
							// Check for name override
							if (language_override.name_override)
							{
								ability_name = language_override.name_override;
							}

							// Check for description overrides
							if (language_override.description_override)
							{
								ability_description = language_override.description_override;
							}

							// Check for reimagined effect overrides
							//if (language_override.reimagined_effects_override)
							//{
								//reimagined_effects = language_override.reimagined_effects_override;
							//}

							// Check for lore override
							if (language_override.lore_override)
							{
								ability_lore = language_override.lore_override;
							}

							// Check for note override
							if (language_override.notes_override)
							{
								ability_notes = language_override.notes_override;
							}

							// Check for scepter override
							if (language_override.scepter_description_override)
							{
								scepter_description = language_override.scepter_description_override;
							}

							// Check for shard override
							if (language_override.shard_description_override)
							{
								shard_description = language_override.shard_description_override;
							}

							// Check for ability specials override, if any
							if (language_override.ability_specials_override)
							{
								ability_specials = language_override.ability_specials_override;
							}
						}
					}
				}

				// Add name localization
				if (ability_name)
				{
					tokens[ability_string] = ability_name;
				}                

				// Add description localization
				if (ability_description)
				{
					ability_description = this.TransformForLocalization(ability_description, false);
					tokens[`${ability_string}_description`] = ability_description;
				}                

				// Lore, if any
				if (ability_lore)
				{
					const transformed_lore = this.TransformForLocalization(ability_lore, false);
					tokens[`${ability_string}_Lore`] = transformed_lore;                    
				}

				// Notes, if any
				if (ability_notes)
				{
					let counter = 0;
					for (const note of ability_notes)
					{
						const transformed_note = this.TransformForLocalization(note, false);
						tokens[`${ability_string}_Note${counter}`] = transformed_note;                        

						counter++;
					}
				}

				// Scepter, if any
				if (scepter_description)
				{
					const ability_scepter_description = this.TransformForLocalization(scepter_description, false);
					tokens[`${ability_string}_scepter_description`] = ability_scepter_description;                    
				}

				// Shard, if any
				if (shard_description)
				{
					const ability_shard_description = this.TransformForLocalization(shard_description, false);
					tokens[`${ability_string}_shard_description`] = ability_shard_description;                    
				}

				// Ability specials, if any
				if (ability_specials)
				{
					for (const ability_special of ability_specials)
					{
						// Construct the ability special
						let ability_special_text = "";

						if (ability_special.percentage)
						{
							ability_special_text = "%";
						}
						else if (ability_special.item_stat)
						{
							ability_special_text = "+$"
						}

						ability_special_text += ability_special.text;

						tokens[`${ability_string}_${ability_special.ability_special}`] = ability_special_text;                        
					}
				}
			}
		}

		// Go over modifiers
		if (localized_data.ModifierArray) {
			for (const modifier of localized_data.ModifierArray)
			{
				const modifier_string = `DOTA_Tooltip_${modifier.modifier_classname}`;

				// Name
				let modifier_name = modifier.name;
				let modifier_description = modifier.description;

				if (modifier.language_overrides)
				{
					for (const language_override of modifier.language_overrides)
					{
						if (language_override.language === language)
						{
							// Name overrides for a specific language, if necessary
							if (language_override.name_override)
							{
								modifier_name = language_override.name_override;
							}

							// Description overrides for a specific language, if necessary
							if (language_override.description_override)
							{
								modifier_description = language_override.description_override;
							}
						}
					}
				}

				// Add name to localization string
				if (modifier_name)
				{
					tokens[modifier_string] = modifier_name;
				}                

				// Add description to localization string
				if (modifier_description)
				{
					modifier_description = this.TransformForLocalization(modifier_description, true);
					tokens[`${modifier_string}_description`] = modifier_description;
				}                
			}
		}

		return tokens;
	}

	WriteContentToAddonFile(language: string, tokens: KVObject)
	{
		// Set based on language
		const filepath = this.addon_filepath + language.toString() + this.filepath_format;

		// Remove file contents, or create a fresh one if it doesn't exists yet.
		const fd = fs.openSync(filepath, 'w');
		fs.closeSync(fd);

		// Add the opening tokens        
		const kv = {lang: { Language: language, Tokens: tokens}}

		// Serialize!        
		let write_string = serialize(kv);

		// Write to the file
		fs.writeFileSync(filepath, write_string);

		// Prepare the output
		this.currentWrites.add(language);
		if (this.writeTimeout) {
			clearTimeout(this.writeTimeout);
		}
		this.writeTimeout = setTimeout(() => this.FinishWrite(), 500);
	}

	// Print the output
	FinishWrite() {
		if (this.currentWrites.size === 0) return;
		let languages: string[] = [];
		for (const language of this.currentWrites.values()) {
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
