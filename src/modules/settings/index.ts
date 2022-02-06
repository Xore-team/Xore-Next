import ModuleBase from "../Module.base";
import CommandModule from "./Command";
import Event from "./Event";
import ModLog from "./ModLog";
import Module from "./Module";
import Prefix from "./Prefix";
import SetLog from "./SetLog";

export = new ModuleBase({
    name: "settings",
    enabled: true,
    can_be_disabled: false,
    emoji: "⚙",
    init() {
        return [
            new Prefix(), 
            new Module(), 
            new ModLog(), 
            new CommandModule(),
            new SetLog(),
            new Event()
        ];
    }
});