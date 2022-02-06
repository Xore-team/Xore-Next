import { ClientEvents, Guild } from "discord.js";
import _ from "lodash";
import BaseXoreClient from "./client/BaseXoreClient";

export = class EventDispatcher {
    public xore: BaseXoreClient;

    public constructor(xore: BaseXoreClient) {
        this.xore = xore;
    }

    private get db() {
        return this.xore.base.prisma;
    }

    public async getChannel(guild: Guild) {
        let data = await this.db.guildLogChannelSettings.findFirst({
            where: {
                guild: guild.id
            }
        });

        if (!data) {
            return false;
        } else {
            return data;
        }
    }

    public async canRunEvent(event: string, guild: Guild) {
        let data = await this.db.guildEventSettings.findFirst({
            where: {
                guild: guild.id
            }
        });
        
        if (!data) {
            return true;
        } else {
            return !data.events.includes(event);
        }
    }

    async send(guild: Guild, type: string, text: string) {
        let data = await this.getChannel(guild);
        let canRun = await this.canRunEvent(type, guild);

        if (!canRun) {
            return;
        }

        if (!data) {
            return;
        }

        let channel = this.xore.channels.cache.get(data.channel);

        if (!channel) {
            return;
        }

        if (channel.isText() && channel.type === "GUILD_TEXT") {
            channel.send(`**\`${type}\`** - ${text}`);
        }
    }
}