import { Message, MessageEmbed } from "discord.js";
import _ from "lodash";
import { Command, CommandCtx } from "../Command.base";

export = class Avatar extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "avatar",
            description: "Gets the mentioned or member's avatar",
            sendTyping: true
        });
    }

    public run(ctx: CommandCtx): void {
        let member = ctx.message.mentions.members?.first() ?? ctx.message.member;


        ctx.message.channel.send({
            embeds: [{
                title: "Avatar",
                image: {
                    url: member?.displayAvatarURL({ dynamic: true, size: 2048 })
                },
                color: [0x014f86, 0xab2836, 0x5a189a, 0xffff47][_.random(0, 4)] 
            }]
        });
    }
}