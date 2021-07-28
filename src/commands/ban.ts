import { Client, CommandInteraction, GuildMember } from 'discord.js';
import { Command } from 'src/@types/Util.js';

import { checkPermission, higherRole } from '../utils.js';

export const name: Command['name'] = 'ban';

export const create: Command['create'] = {
    name: 'ban',
    description: 'Bans a user! | Requires [BAN_MEMBERS]',
    options: [
        {
            name: 'user',
            description: 'The user who should be banned',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the ban',
            type: 'STRING'
        }
    ]
};

export const execute: Command['execute'] = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    // Grab important informations
    const executor: GuildMember = interaction.member as GuildMember;
    const target: GuildMember = interaction.options.getMember('user', true) as GuildMember;
    const reason: string = interaction.options.getString('reason') ||  '';

    // Return error if executor or target are invalid
    if (!executor || !target) return (interaction.editReply('Something went wrong!') as unknown) as void;

    // Check if permissions are valid
    if (!checkPermission(executor, 'BAN_MEMBERS')) return (interaction.editReply('You do not have the required permissions to ban a member.') as unknown) as void;
    if (!higherRole(executor.roles.highest, target.roles.highest)) return (interaction.editReply('You do not have the required permissions to ban this member.') as unknown) as void;

    const banned: GuildMember | null = await target.ban({ days: 7, reason: reason }).catch(() => null);
    if (banned) {
        // Success
        return (interaction.editReply('Member successfully banned!') as unknown) as void;
    } else {
        // No Success
        return (interaction.editReply('Something went wrong!') as unknown) as void;
    }
};
