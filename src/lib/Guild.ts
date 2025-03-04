import { type Guild as GuildT, type GuildMember as GuildMemberT, type GuildBasedChannel as GuildBasedChannelT, ChannelType, Role } from "discord.js";
import { client } from "..";

export class Guild {
    guild = {
        all: (): GuildT[] => {
            return client.guilds.cache.toJSON();
        },
        byId: (guildId: string): GuildT => {
            const guilds = this.guild.all().filter(guild => guild.id === guildId);
            return guilds[0];
        },
    };
    invites = {
        create: (guildId: string, channelId?: string) => {
            const guild = this.guild.byId(guildId);
            if (channelId) {
                const channel = this.channels.all(guildId).filter(channel => channel.id === channelId)[0];
                const invite = guild.invites.create(channel);
                return invite;
            }
            const channel = this.channels.all(guildId).filter(channel => channel.type === ChannelType.GuildText)[0];
            const invite = guild.invites.create(channel);
            return invite;
        },
        remove: (guildId: string, inviteId: string) => {
            const guild = this.guild.byId(guildId);
            const invite = guild.invites.delete(inviteId);
            return invite;
        }
    };
    members = {
        all: (guildId: string): GuildMemberT[] => {
            const guild = this.guild.byId(guildId);
            return guild.members.cache.toJSON();
        },
        byId: (guildId: string, userId: string): GuildMemberT => {
            const members = this.members.all(guildId).filter(member => member.id === userId);
            return members[0];
        }
    };
    channels = {
        all: (guildId: string): GuildBasedChannelT[] => {
            const guild = this.guild.byId(guildId);
            return guild.channels.cache.toJSON();
        },
        byId: (guildId: string, channelId: string): GuildBasedChannelT => {
            const channels = this.channels.all(guildId).filter(channel => channel.id === channelId);
            return channels[0];
        }
    };
    roles = {
        get: {
            all: (guildId: string): Role[] => {
                const guild = this.guild.byId(guildId);
                return guild.roles.cache.toJSON();
            },
            byId: (guildId: string, roleId: string): Role => {
                const roles = this.roles.get.all(guildId).filter(role => role.id === roleId);
                return roles[0];
            },
            byName: (guildId: string, roleName: string): Role => {
                const roles = this.roles.get.all(guildId).filter(role => role.name === roleName);
                return roles[0];
            }
        }
    };
}

export default new Guild();