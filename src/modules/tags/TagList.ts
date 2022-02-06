import { codeBlock, inlineCodeBlock } from "@sapphire/utilities";
import { Command, CommandCtx } from "../Command.base";

export = class TagList extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "tags",
            description: "Shows the list of avalible guild tags"
        });
    }

    public async run(ctx: CommandCtx) {
        let data = await ctx.client.prisma.guildTags.findMany();
        let tagNames = data.length ? (data.map((tag) => tag.names.join(", "))) : "No tags avalible"
        return ctx.message.channel.send(Array.isArray(tagNames) ? codeBlock("none", tagNames.join(", ")) : tagNames)
    }
}