import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from 'src/@types/Util.js';

import catFacts from 'get-cat-facts';
import api from 'random-stuff-api';

export const name: Command['name'] = 'image';

export const create: Command['create'] = {
    name: 'image',
    description: 'Show a random picture from a specific category!',
    options: [
        {
            name: 'category',
            description: 'Choose a cetegory!',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'Cat',
                    value: 'cat'
                },
                {
                    name: 'Dog',
                    value: 'dog'
                },
                {
                    name: 'Duck',
                    value: 'duck'
                },
                {
                    name: 'Vase',
                    value: 'vase'
                }
            ]
        }
    ]
};

export const execute: Command['execute'] = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const category: string = interaction.options[0].value as string;
    let image = '';
    let fact = '';

    switch (category) {
        case 'cat': {
            image = await api.image.cat();
            while (image.substr(image.length - 3) == 'mp4') {
                image = await api.image.cat();
            }

            fact = (await catFacts.random())[0].text;
            break;
        }
        case 'dog': {
            image = await api.image.dog();
            while (image.substr(image.length - 3) == 'mp4') {
                image = await api.image.dog();
            }
            break;
        }
        case 'duck': {
            image = await api.image.duck();
            while (image.substr(image.length - 3) == 'mp4') {
                image = await api.image.duck();
            }
            break;
        }
        case 'vase': {
            image = await api.image.vase();
            while (image.substr(image.length - 3) == 'mp4') {
                image = await api.image.vase();
            }
            break;
        }
    }

    const embed = new MessageEmbed()
        .setDescription(fact)
        .setImage(image);

    await interaction.editReply(embed);
};