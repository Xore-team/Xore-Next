import { Command } from "../src/modules/Command.base";

class Example extends Command {
    public onCommandLoad() {
        this.setup({
            name: "example",
            description: "hi"
        });
    }
}