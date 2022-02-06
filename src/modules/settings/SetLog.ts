import { Command, CommandCtx } from "../Command.base";

export = class SetLog extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "setlog",
            description: "Sets the guild's current log channel for events",
            beDisabled: false,
            permissions: {
                user: ["MANAGE_GUILD"]
            }
        });
    }

    public async run({ message, client }: CommandCtx) {
        let channel = message.mentions.channels.first();

        if (!channel) {
            return message.channel.send("Please mention a channel to send logs");
        }

        let data = await client.prisma.guildLogChannelSettings.findFirst({
            where: {
                guild: message.guild?.id
            }
        });

        let state;

        if (!data) {
            state = "Set";
            await client.prisma.guildLogChannelSettings.create({
                data: {
                    guild: message.guild?.id!,
                    channel: channel.id
                }
            });
        } else {
            state = "Updated";
            await client.prisma.guildLogChannelSettings.update({
                where: {
                    guild: message.guild?.id
                },
                data: {
                    channel: channel.id
                }
            });
        }

        message.channel.send(`${this.emotes.yes} ${state} Logs to channel <#${channel.id}>`);
    }
}