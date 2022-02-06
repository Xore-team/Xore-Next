import { codeBlock } from "@sapphire/utilities";
import { ClientEvents } from "discord.js";
import _ from "lodash";
import { Command, CommandCtx } from "../Command.base";

export = class Event extends Command {
    public onCommandLoad() {
        this.setup({
            name: "event",
            description: "Sets a log event"
        });
    }

    public get events(): (keyof ClientEvents)[] {
        return [
            "messageDelete",
            "messageUpdate"
        ];
    }

    public async run({ message, args, client }: CommandCtx) {
        let state;

        args[0] = _.camelCase(args[0]);

        if (!this.events.includes(args[0] as (keyof ClientEvents))) {
            return message.channel.send(`The event \`${args[0]}\` must be one of the above:\n${codeBlock("diff", this.events.join("\n"))}`);
        }
        
        let data = await client.prisma.guildEventSettings.findFirst({
            where: {
                guild: message.guild?.id,
            }
        });

        if (!data) {
            state = "Disabled";
            await client.prisma.guildEventSettings.create({
                data: {
                    events: [args[0]],
                    guild: message.guild?.id!
                }
            });
        } else {
            if (data.events.includes(args[0])) {
                let index = data.events.indexOf(args[0]);
                let arr = [...data.events];
                delete arr[index];

                if (index !== -1) {
                    state = "Enabled";
                    await client.prisma.guildEventSettings.update({
                        where: {
                            guild: message.guild?.id
                        },
                        data: {
                            events: [...arr]
                        }
                    });
                }
            } else {
                state = "Disabled";
                await client.prisma.guildEventSettings.delete({
                    where: {
                        guild: message.guild?.id
                    }
                });
                await client.prisma.guildEventSettings.create({
                    data: {
                        guild: message.guild?.id!,
                        events: [args[0], ...data.events]
                    }
                })
            }
        }
        message.channel.send(`${this.emotes.yes} ${state} guild event \`${args[0]}\``);
    }
}