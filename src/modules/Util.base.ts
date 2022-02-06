export = class CommandUtil {
    static remove<T extends string | number>(arr: T[], item: number | string) {
        return arr.filter((val) => val != item);
    }
}