import { Client, CommandInteraction } from 'discord.js';
import { Command } from 'src/@types/Util.js';

export const name: Command['name'] = 'ping';

export const create: Command['create'] = {
    name: 'ping',
    description: 'Ping Pong!',
};

export const execute: Command['execute'] = (client: Client, interaction: CommandInteraction): void => {
    interaction.editReply(':tada: | Still alive!');
};