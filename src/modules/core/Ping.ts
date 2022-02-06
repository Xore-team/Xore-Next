import ms from "ms";
import { Pastels } from "../Colors.base";
import { Command, CommandCtx } from "../Command.base";
import { Strings } from "../Types.base";

export = class Ping extends Command {
    public onCommandLoad(): void {
        this.setup({ 
            name: "ping", 
            description: "Pings the bot, and shows the gateway in milliseconds", 
            sendTyping: true,
            beDisabled: false
        });

        this.loadEmbeds((Embed) => ({
            edit: new Embed()
               .setDescription(`Pong! \`{ms}\``)
               .setColor(Pastels.pasYellow)
        }));
    }

    public run({ message }: CommandCtx): void {
        let now = Date.now();

        message.channel.send("Ping?").then((msg) => {
            this
            setTimeout(() => {
                let diff = (Date.now() - now);
                this.embeds.edit.description = this.embeds.edit.description!.replace("{ms}", diff.toString());
                msg.edit({ content: Strings.BLANK, embeds: [this.embeds.edit] });
            }, ms("30ms"));
        });
    }
}