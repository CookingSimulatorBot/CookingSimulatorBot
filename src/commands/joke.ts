import { Client, CommandInteraction } from 'discord.js';
import { Command } from 'src/@types/Util.js';
import { MessageEmbed } from 'discord.js';
import api from 'random-stuff-api';

export const name: Command['name'] = 'joke';

export const create: Command['create'] = {
    name: 'joke',
    description: 'Show a joke from a specific category!',
    options: [
        {
            name: 'category',
            description: 'Choose a cetegory!',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'Normal',
                    value: 'normal'
                },
                {
                    name: 'Chuck Norris',
                    value: 'cn'
                },
                {
                    name: 'Developer',
                    value: 'dev'
                }
            ]
        }
    ]
};

export const execute: Command['execute'] = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const category = interaction.options[0].value;
		
    let joke = '';

    switch (category) {
        case 'normal': {
            joke = await api.random.joke();
            break;
        }
        case 'cn': {
            joke = await api.random.cnjoke();
            break;
        }
        case 'dev': {
            joke = await api.random.devjoke();
            break;
        }
    }

    const embed = new MessageEmbed()
        .setDescription(joke);

    await interaction.editReply(embed);
};