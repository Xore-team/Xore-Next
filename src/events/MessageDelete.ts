import { codeBlock } from "@discordjs/builders";
import DispatchEvent from "./DispatchEvent";

export = new DispatchEvent("messageDelete", async (xore, dispatch, message) => {
    if (!message.guild) {
        return;
    }

    try {
        await dispatch.send(message.guild, "messageDelete", `${message.author?.username} had a deleted message in <#${message.channel.id}>\n${codeBlock(message.content!)}`);
    } catch (e) {
        console.log(`Cannot send log ${e}`);
    }
});