import { Command, CommandCtx } from "../Command.base";
import { inlineCode } from "@discordjs/builders";
import { EmbedFieldData } from "discord.js";
import _ from "lodash";

export = class Help extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "help",
            description: "Shows the help menu",
            beDisabled: false,
            sendTyping: true
        });
    }

    public run(ctx: CommandCtx) {
        if (!ctx.args.length) {
            let cam = ctx.client.modules.map((c) => ({
                name: c.name,
                emoji: c.emoji,
                commands: c.init().map((v) => {
                    v.onCommandLoad();
                    return inlineCode(v.name);
                })
            }));

            let fields: EmbedFieldData[] = [];

            for (let data of cam) {
                fields.push({
                    name: `${data.emoji} ${_.upperFirst(data.name)}`,
                    value: data.commands.join(", "),
                    inline: true
                })
            }

            let color = [0x3e1f47, 0x144552][_.random(0, 1)];

            return ctx.message.channel.send({ embeds: [{ fields, color }] });
        }
    }
}