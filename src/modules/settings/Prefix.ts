import { Command, CommandCtx } from "../Command.base";

export = class Prefix extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "prefix",
            description: "Sets the guild's current prefix",
            beDisabled: false,
            permissions: {
                user: ["MANAGE_GUILD"]
            }
        });
    }

    public async run({ client, message, args }: CommandCtx): Promise<void> {
        async function updatePrefix() {
            let data = await client.prisma.guildPrefixes.findFirst({
                where: {
                    guild: message.guild?.id
                }
            });
    
            if (!data) {
                await client.prisma.guildPrefixes.create({
                    data: {
                        guild: message.guild?.id!,
                        prefix: args[0]
                    }
                });
            } else {
                await client.prisma.guildPrefixes.update({
                    where: {
                        guild: message.guild?.id!
                    },
                    data: {
                        prefix: args[0]
                    }
                })
            }
        }

        let m = await message.channel.send({
            embeds: [{
                description: `Are you sure you want to update the guild prefix?`,
                color: "RED"
            }],
            components: [{
                type: "ACTION_ROW",
                components: [{
                    type: "BUTTON",
                    customId: "y",
                    label: "Yes",
                    style: "SECONDARY"
                }, {
                    type: "BUTTON",
                    customId: "n",
                    label: "No",
                    style: "DANGER"
                }]
            }]
        })

        let collector = m.createMessageComponentCollector({
            componentType: "BUTTON",
            filter: (interaction) => interaction.user.id === message.author.id
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "y") {
                await updatePrefix();
                collector.stop("yes");
                await interaction.update({
                    embeds: [],
                    components: [],
                    content: `${this.emotes.yes} Updated the guild prefix to ${args[0]}`
                });
            } else if (interaction.customId === "n") {
                collector.stop("canceled");
                await interaction.update({
                    embeds: [],
                    components: [],
                    content: "Cancled prefix update, stopped collector"
                });
            }
        })
    }
}