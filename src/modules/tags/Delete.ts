import { Command, CommandCtx } from "../Command.base"
import CommandUtil from "../Util.base";

export = class TagDelete extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "tag-delete",
            description: "Deletes a specified tag",
            permissions: {
                user: ["MANAGE_MESSAGES"]
            }
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
            let newArr = CommandUtil.remove(data.names, ctx.args[0]);
            let bodyArr = CommandUtil.remove(data.bodies, data.bodies[data.names.indexOf(ctx.args[0])])
            await ctx.client.prisma.guildTags.update({
                where: {
                    guild: ctx.message.guild?.id!
                },
                data: {
                    names: [...newArr],
                    bodies: [...bodyArr]
                }
            });
        }

        ctx.message.channel.send(`${this.emotes.yes} Deleted tag \`${ctx.args[0]}\``);
    }
}