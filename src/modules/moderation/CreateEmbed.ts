import { MessageEmbedOptions } from "discord.js";

export default function createEmbed(options: EmbedOptions): MessageEmbedOptions[] {
    return [{
        title: `Someone got ${options.type}`,
        description: `${options.emoji} ${options.text}`,
        color: options.color
    }]
}

interface EmbedOptions {
    emoji: string;
    text: string;
    color: number;
    type: "banned" | "kicked";
}