import { GuildMember, Role, PermissionResolvable } from 'discord.js';

export const checkPermission = (member: GuildMember, permission: PermissionResolvable): boolean => {
    if (!member) return false;
    return member.permissions.has(permission);
};

export const higherRole = (shouldBeHigher: Role, shouldBeLower: Role): boolean => {
    return Role.comparePositions(shouldBeHigher, shouldBeLower) > 0 ? true : false;
};

export const getRandom = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};
    
export const clean = (text: string): string => {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
        return text;
    }
};