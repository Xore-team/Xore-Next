import { Command, CommandCtx } from "../Command.base";

export = class ModLog extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "modlog",
            description: "Sets the guilds current modlog for moderation",
            beDisabled: false,
            permissions: {
                user: ["MANAGE_CHANNELS"]
            }
        });
    }

    public async run({ message, client }: CommandCtx) {
        let channel = message.mentions.channels.first();

        if (!channel) {
            return message.channel.send("Mention a channel for me to send logs in");
        }

        let state;

        let data = await client.prisma.guildModLogSettings.findFirst({
            where: {
                guild: message.guild?.id
            }
        });

        if (!data) {
            state = "Set";
            await client.prisma.guildModLogSettings.create({
                data: {
                    guild: message.guild?.id!,
                    channel: channel.id
                }
            });
        } else {
            state = "Updated";
            await client.prisma.guildModLogSettings.update({
                where: {
                    guild: message.guild?.id
                },
                data: {
                    channel: channel.id
                }
            });
        }

        if (channel.type !== "GUILD_TEXT") {
            return message.channel.send(`${this.emotes.no} ${channel.id} isn't a guild channel nor textable`);
        }

        return message.channel.send(`${this.emotes.yes} ${state} the current modlog setting to <#${channel.id}> (\`${channel.name}\`)`);
    }
}