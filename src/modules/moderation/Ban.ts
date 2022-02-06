import { GuildChannel } from "discord.js";
import { Command, CommandCtx } from "../Command.base";
import ModerationBase from "./ModerationBase";

export = class Ban extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "ban",
            description: "Banning the member within the guild",
            permissions: {
                client: ["BAN_MEMBERS"],
                user: ["BAN_MEMBERS"]
            }
        });
    }

    public async run(ctx: CommandCtx) {
        let member = ctx.message.mentions.members?.first();

        if (!member) {
            return ctx.message.channel.send("Please mention a user to ban");
        }

        let reason = ctx.args.slice(1).join(" ");
        let channel = ctx.message.channel as GuildChannel;
        let { client } = ctx;
        
        let data = await new ModerationBase({ member, reason, channel, client })
             .ban({ log: true });

        if (typeof data === "string") {
            return ctx.message.channel.send(data);
        }

        ctx.message.channel.send(`${this.emotes.yes} Banned member \`${member.user.username}\``);
    }
}