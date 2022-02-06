import { Command, CommandCtx } from "../Command.base"

export = class TagDelete extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "tag-delete",
            description: "Deletes a specified tag"
        });
    }

    public async run(ctx: CommandCtx) {
        if (!ctx.args[0]) {
            return ctx.message.channel.send("Please provide a tag name to find");
        }

        let data = await ctx.client.prisma.guildTags.findFirst({
            where: {
                guild: ctx.message.guild?.id,
                names: {
                    has: ctx.args[0]
                }
            }
        });

        const sendError = () => {
            return ctx.message.channel.send(`${this.emotes.no} Tag \`${ctx.args[0]}\` doesn't exist`);
        }

        if (!data) {
            return sendError();
        } else {
            await ctx.client.prisma.guildTags.delete({
                where: {
                    guild: data.guild
                },
            });
            console.log(data)
        }
    }
}