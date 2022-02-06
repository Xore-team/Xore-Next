import { codeBlock } from "@discordjs/builders";
import { Guild } from "discord.js";
import DispatchEvent from "./DispatchEvent";

export = new DispatchEvent("messageUpdate", async (xore, dispatch, oldMessage, newMessage) => {
    try {
        if (!newMessage.partial) {
            await dispatch.send(newMessage.guild as Guild, "messageUpdate", `${newMessage.author.username} edited a message\nold: ${codeBlock(oldMessage.content as string)}\nnew: ${codeBlock(newMessage.content as string)}`);
        }
    } catch (e) {
        console.log(`Cannot send log ${e}`);
    }
})