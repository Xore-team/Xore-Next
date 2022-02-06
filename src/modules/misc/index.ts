import Module from "../Module.base";
import Avatar from "./Avatar";

export = new Module({
    name: "misc",
    can_be_disabled: true,
    enabled: true,
    emoji: "🎮",
    init() {
        return [
            new Avatar()
        ];
    }
});