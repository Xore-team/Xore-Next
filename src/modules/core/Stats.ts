import { ColorResolvable, EmbedFieldData } from "discord.js";
import { Command, CommandCtx } from "../Command.base";

export = class Stats extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "stats",
            description: "Shows a embed of the bots status"
        });
    }

    public run(ctx: CommandCtx) {
        if (ctx.args[0] === "-shards") {
            let fields: EmbedFieldData[] = [];
            let shards = ctx.client.instance.ws.shards.map((shard) => ({
                id: shard.id,
                heartbeat: shard.status
            }));
            for (let shard of shards) {
                fields.push({ 
                    name: shard.id.toString(), 
                    value: `${shard.heartbeat}ms`,
                    inline: true
                });
            }
            let title: string = `Shard List (${shards.length})`;
            let color: ColorResolvable = "GREEN";
            return ctx.message.channel.send({ embeds: [{ fields, color }] });
        }

        let fields: EmbedFieldData[] = [{
            name: "Shards Total",
            value: ctx.client.instance.ws.shards.size.toString(),
            inline: true
        }, {
            name: "Platform",
            value: process.platform,
            inline: true
        }];

        let color: ColorResolvable = "GOLD";
        ctx.message.channel.send({ embeds: [{ fields, color }] });
    }
}