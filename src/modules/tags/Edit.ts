import { Command, CommandCtx } from "../Command.base";

export = class TagEdit extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "tag-edit",
            description: "Edits a guild tag specified"
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
        if (data) {
            let index = data.names.indexOf(ctx.args[0]);
            let name = data.names.find((val) => val === ctx.args[0]);
            let names = [...data.names];
            let bodies = [...data.bodies];

            if (!name) {
                return ctx.message.channel.send(`${this.emotes.no} That tag doesn't appear to exist`);
            }

            names[index] = ctx.args[0];
            bodies[index] = ctx.args.slice(1).join(" ");

            await ctx.client.prisma.guildTags.update({
                where: {
                    guild: ctx.message.guild?.id
                },
                data: { names, bodies }
            });
        } else {
            return ctx.message.channel.send(`${this.emotes.no} No data found for this guild`);
        }

        ctx.message.channel.send(`${this.emotes.yes} Edited tag \`${ctx.args[0]}\``);
    }
}