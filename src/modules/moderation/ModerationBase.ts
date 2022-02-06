import { BanOptions, GuildChannel, GuildMember } from "discord.js";
import _ from "lodash";
import { CommandCtx } from "../Command.base";
import createEmbed from "./CreateEmbed";

export = class ModerationBase {
    public options: ModerationSettings;

    public constructor(options: ModerationSettings) {
        this.options = options;
    }

    public async getChannel() {
        let data = await this.options.client.prisma.guildModLogSettings.findFirst({
            where: {
                guild: this.options.channel.guild.id
            },
        });

        if (!data) {
            return "None_Channel";
        } else {
            return data;
        }
    }

    public async createBase(type: "ban" | "kick", { log }: ModOptions) {
        let modlog = await this.getChannel();

        if (!this.options.member[type === "ban" ? "bannable" : "kickable"]) {
            return `${this.options.member.user.username} is not ${type === "ban" ? "bannable" : "kickable"}`;
        }

        if (!this.options.member.moderatable) {
            return `${this.options.member.user.username} cannot be ${type === "ban" ? "banned" : "kicked"}`;
        }

        try {
            // @ts-ignore me when
            let option: BanOptions & string = type === "ban" ? { reason: this.options.reason } : this.options.reason;
            await this.options.member[type](option);

            if (typeof modlog === "string") {
                return;
            } else {
                if (log) {
                    let channel = this.options.client.instance.channels.cache.get(modlog.channel);

                    if (!channel) return;

                    if (channel.isText() && channel.type === "GUILD_TEXT") {
                        await channel.send({
                            embeds: createEmbed({
                                color: _.parseInt(modlog.embedColor),
                                text: `\`${this.options.member.user.username}\` was ${type === "ban" ? "banned" : "kicked"}`,
                                emoji: type === "ban" ? "🔨" : "🪛",
                                type: type === "ban" ? "banned" : "kicked"
                            }
                        )});
                    }
                }
            }
        } catch (e) {
            return "Unable to ban member";
        }
    }

    public async kick({ log }: ModOptions) {
        return this.createBase("kick", { log });
    }

    public async ban({ log }: ModOptions) {
        return this.createBase("ban", { log });
    }
}

interface ModerationSettings {
    member: GuildMember;
    reason: string;
    client: CommandCtx["client"];
    channel: GuildChannel;
}

interface ModOptions {
    log: boolean;
}