import { Command, CommandCtx } from "../Command.base";

export = class TagCreate extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "tag-create",
            description: "Creates a tag for the guild"
        });
    }

    public checkArgs(args: string[], type: "name" | "body") {
        if (type === "name") {
            if (!args[0]) {
                return false;
            }
        } else if (type === "body") {
            if (!args.slice(1).length) {
                return false;
            }
        }
        return true;
    }

    public async run(ctx: CommandCtx) {
        let data = await ctx.client.prisma.guildTags.findFirst({
            where: {
                guild: ctx.message.guild?.id,
            }
        });

        let name = this.checkArgs(ctx.args, "name");
        let body = this.checkArgs(ctx.args, "body");

        if (!name) {
            return ctx.message.channel.send("Provide a name for the tag!");
        }
        if (!body) {
            return ctx.message.channel.send("Send text for the body!");
        }

        console.log(data)
        if (data && data.names.includes(ctx.args[0])) {
            return ctx.message.channel.send(`${this.emotes.no} Tag \`${ctx.args[0]}\` was already created`);
        } else if (data && data.names.length) {
            await ctx.client.prisma.guildTags.delete({ where: { guild: ctx.message.guild?.id } });
            await ctx.client.prisma.guildTags.create({
                data: {
                    guild: ctx.message.guild?.id!,
                    names: [ctx.args[0], ...data.names],
                    bodies: [ctx.args.slice(1).join(" ")]
                }
            });
        } else if (!data) {
            await ctx.client.prisma.guildTags.create({
                data: {
                    guild: ctx.message.guild?.id!,
                    names: [ctx.args[0]],
                    bodies: [ctx.args.slice(1).join(" ")]
                }
            });
        }

        ctx.message.channel.send(`${this.emotes.yes} Created tag \`${ctx.args[0]}\``);
    }
}