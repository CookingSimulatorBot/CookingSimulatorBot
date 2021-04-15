import { Client, CommandInteraction } from 'discord.js';
import { Command } from 'src/@types/Util.js';
import { getRandom } from '../utils.js';
import recipes from '../recipes.json';

export const name: Command['name'] = 'recipe';

export const create: Command['create'] = {
    name: 'recipe',
    description: 'Let the bot choose what to cook next!',
    options: [
        {
            name: 'mode',
            description: 'The gamemode you want to cook for!',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'Normal',
                    value: 'normal'
                },
                {
                    name: 'Mobile',
                    value: 'mobile'
                },
                {
                    name: 'Cakes and Cookies DLC',
                    value: 'cac'
                },
                {
                    name: 'Pizza DLC',
                    value: 'pizza'
                }
            ]
        },
    ]
};

export const execute: Command['execute'] = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    // Informations
    const mode = interaction.options[0].value;

    let recipesMode: string[] = [];
    switch (mode) {
        case 'normal': {
            recipesMode = recipes.normal;
            break;
        }
        case 'mobile': {
            recipesMode = recipes.mobile;
            break;
        }
        case 'cac': {
            recipesMode = recipes.cac;
            break;
        }
        case 'pizza': {
            recipesMode = recipes.pizza;
            break;
        }
    }

    const recipeToCook = recipesMode[getRandom(0, recipesMode.length)];
    setTimeout(() => {
        interaction.editReply(`You should make some **${recipeToCook}**!`);
    }, 5000);
};