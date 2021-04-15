import { Client, CommandInteraction, Guild, GuildMember, User } from 'discord.js';
import { Command } from 'src/@types/Util.js';
import * as utils from '../utils.js';

export const name: Command['name'] = 'kick';

export const hidden: Command['hidden'] = true;

export const create: Command['create'] = {
    name: 'kick',
    description: 'Kicks a user! | Requires [KICK_MEMBERS]',
    options: [
        {
            name: 'user',
            description: 'The user who should be kicked',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the kick',
            type: 'STRING'
        },
        {
            name: 'deleteMessages',
            description: 'If the messages of this user should be deleted',
            type: 'BOOLEAN'
        }
    ]
};

export const execute = async (client: Client, interaction: CommandInteraction): Promise<void> => {

    const guild = client.guilds.cache.get(interaction.guildID as string) as Guild;

    // Grab important informations
    const executor: GuildMember = interaction.member as GuildMember;
    const target: GuildMember = interaction.options.find(o => o.name == 'user')?.member as GuildMember;
    const targetUser: User = target.user;

    let reason = '';
    if (interaction.options.find(o => o.name.toLowerCase() == 'reason')) {
        reason = interaction.options.find(o => o.name.toLowerCase() == 'reason')?.value as string;
    }
    let purge = false;
    if (interaction.options.find(o => o.name.toLowerCase() == 'deletemessages')) {
        purge = interaction.options.find(o => o.name.toLowerCase() == 'deletemessages')?.value as boolean;
    }

    // Check if permissions are valid
    if (!utils.checkPermission(executor, 'BAN_MEMBERS')) return (interaction.editReply('You do not have the required permissions to kick a member.') as unknown) as void;
    if (!utils.higherRole(executor.roles.highest, target.roles.highest)) return (interaction.editReply('You do not have the required permissions to kick this member.') as unknown) as void;

    // Check if messages should be purged
    if (purge) {
        const banned: GuildMember | null = await target.ban({ days: 7, reason: reason}).catch(() => null);
        if (banned) {
            // Success
            guild.members.unban(targetUser);
            return (interaction.editReply('Member successfully kicked!') as unknown) as void;
        } else {
            // No success
            return (interaction.editReply('Something went wrong!') as unknown) as void;
        }
    } else {
        const kicked: GuildMember | null = await target.kick(reason).catch(() => null);
        if (kicked) {
            // Success
            return (interaction.editReply('Member successfully kicked!') as unknown) as void;
        } else {
            // No Success
            return (interaction.editReply('Something went wrong!') as unknown) as void;
        }
    }
};