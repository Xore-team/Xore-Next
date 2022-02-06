import Module from "../Module.base";
import Ban from "./Ban";
import Kick from "./Kick";

export = new Module({
    name: "mod",
    can_be_disabled: true,
    enabled: true,
    emoji: "🔧",
    init() {
        return [new Kick(), new Ban()]
    }
})