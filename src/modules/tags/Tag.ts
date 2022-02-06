import { Command, CommandCtx } from "../Command.base";

export = class Tag extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "tag",
            description: "Views a tag"
        });
    }

    public async run(ctx: CommandCtx) {
        if (!ctx.args) {
            return ctx.message.channel.send("Please provide a tag name to find");
        }

        let data = await ctx.client.prisma.guildTags.findFirst({
            where: {
                guild: ctx.message.guild?.id
            }
        });

        if (!data) {
            return ctx.message.channel.send(`${this.emotes.no} there is no data for tags`);
        } else {
            let index = data.names.indexOf(ctx.args[0]);
            let tagName = data.names.find((val) => val === data?.names[index]);
            let tagBody = data.bodies.find((val) => val === data?.bodies[index]);

            if (!tagName && !tagBody) {
                return ctx.message.channel.send(`${this.emotes.no} Tag \`${ctx.args[0]}\` couldn't be found`);
            }

            return ctx.message.channel.send(tagBody!);
        }
    }
}