import { GuildChannel } from "discord.js";
import { Command, CommandCtx } from "../Command.base";
import ModerationBase from "./ModerationBase";

export = class Kick extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "kick",
            description: "Kicking the member within the guild",
            permissions: {
                user: ["KICK_MEMBERS"],
                client: ["KICK_MEMBERS"]
            }
        });
    }

    public async run(ctx: CommandCtx) {
        let member = ctx.message.mentions.members?.first();

        if (!member) {
            return ctx.message.channel.send("Please mention a user to kick");
        }

        let reason = ctx.args.slice(1).join(" ");
        let channel = ctx.message.channel as GuildChannel;
        let { client } = ctx;
        
        let data = await new ModerationBase({ member, reason, channel, client })
             .kick({ log: true });

        if (typeof data === "string") {
            return ctx.message.channel.send(data);
        }

        ctx.message.channel.send(`${this.emotes.yes} Kicked member \`${member.user.username}\``);
    }
}