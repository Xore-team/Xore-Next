import { Command, CommandCtx } from "../Command.base";

export = class Module extends Command {
    public onCommandLoad(): void {
        this.setup({
            name: "module",
            description: "Enables or Disables a client module",
            beDisabled: false,
            permissions: {
                user: ["MANAGE_GUILD"]
            }
        });
    }

    public async run({ message, args, client }: CommandCtx) {
        let module = client.modules.get(args[0]);
        let state;

        if (!module) {
            return message.channel.send(`Module \`${args[0]}\` doesn't exist`);
        }

        if (!module.can_be_disabled) {
            return message.channel.send(`${this.emotes.no} Module \`${module.name}\` cannot be disabled`);
        }

        let data = await client.prisma.guildModuleSettings.findFirst({
            where: {
                guild: message.guild?.id,
            }
        });

        if (!data) {
            state = "Disabled";
            await client.prisma.guildModuleSettings.create({
                data: {
                    modules: [module.name],
                    guild: message.guild?.id!
                }
            });
        } else {
            if (data.modules.includes(module.name)) {
                let index = data.modules.indexOf(module.name);
                let arr = [...data.modules];
                delete arr[index];

                if (index !== -1) {
                    state = "Enabled";
                    await client.prisma.guildModuleSettings.update({
                        where: {
                            guild: message.guild?.id
                        },
                        data: {
                            modules: [...arr]
                        }
                    });
                }
            } else {
                state = "Disabled";
                await client.prisma.guildModuleSettings.delete({
                    where: {
                        guild: message.guild?.id
                    }
                });
                await client.prisma.guildModuleSettings.create({
                    data: {
                        guild: message.guild?.id!,
                        modules: [module.name, ...data.modules]
                    }
                })
            }
        }
        message.channel.send(`${this.emotes.yes} ${state} guild module \`${args[0]}\``);
    }
}