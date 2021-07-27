import { Client, CommandInteraction, Guild, GuildMember, User } from 'discord.js';
import { Command } from 'src/@types/Util.js';
import { checkPermission, higherRole } from '../utils.js';

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

    const guild = client.guilds.cache.get(interaction.guildId as `${bigint}`) as Guild;

    // Grab important informations
    const executor: GuildMember = interaction.member as GuildMember;
    const target: GuildMember = interaction.options.getMember('user', true) as GuildMember;
    const targetUser: User = target.user;

    let reason = '';
    if (interaction.options.getString('reason', false)) {
        reason = interaction.options.getString('reason', true);
    }
    let purge = false;
    if (interaction.options.getString('deletemessages', false)) {
        purge = interaction.options.getBoolean('deletemessages', true);
    }

    // Check if permissions are valid
    if (!checkPermission(executor, 'BAN_MEMBERS')) return (interaction.editReply('You do not have the required permissions to kick a member.') as unknown) as void;
    if (!higherRole(executor.roles.highest, target.roles.highest)) return (interaction.editReply('You do not have the required permissions to kick this member.') as unknown) as void;

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
