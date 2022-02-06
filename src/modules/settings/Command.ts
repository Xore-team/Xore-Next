import { Command, CommandCtx } from "../Command.base";

export = class CommandModule extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "command",
            description: "Disables or enables a module command",
            beDisabled: false,
            permissions: {
                user: ["MANAGE_GUILD"]
            }
        });
    }

    public async run({ message, args, client }: CommandCtx) {
        let command = client.commands.get(args[0]);
        let state;

        if (!command) {
            return message.channel.send(`Command \`${args[0]}\` doesn't exist`);
        }

        if (!command.beDisabled) {
            return message.channel.send(`${this.emotes.no} command \`${command.name}\` cannot be disabled`);
        }

        let data = await client.prisma.guildCommandSettings.findFirst({
            where: {
                guild: message.guild?.id,
            }
        });

        if (!data) {
            state = "Disabled";
            await client.prisma.guildCommandSettings.create({
                data: {
                    commands: [command.name],
                    guild: message.guild?.id!
                }
            });
        } else {
            if (data.commands.includes(command.name)) {
                let index = data.commands.indexOf(command.name);
                let arr = [...data.commands];
                delete arr[index];

                if (index !== -1) {
                    state = "Enabled";
                    await client.prisma.guildCommandSettings.update({
                        where: {
                            guild: message.guild?.id
                        },
                        data: {
                            commands: [...arr]
                        }
                    });
                }
            } else {
                state = "Disabled";
                await client.prisma.guildCommandSettings.delete({
                    where: {
                        guild: message.guild?.id
                    }
                });
                await client.prisma.guildCommandSettings.create({
                    data: {
                        guild: message.guild?.id!,
                        commands: [command.name, ...data.commands]
                    }
                })
            }
        }
        message.channel.send(`${this.emotes.yes} ${state} guild command \`${args[0]}\``);
    }
}