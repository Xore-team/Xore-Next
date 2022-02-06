import _ from "lodash";

export = class Util {
    static pull<T, M = {}, N = T>(obj: T, merge?: M): N | T {
        if (!_.isObject(obj)) {
            throw new Error(`${typeof obj} is not a object`);
        }

        if (merge) {
            obj = { ...obj, ...merge };
        }

        return obj;
    }

    static arr<T, M = any>(array: T[], merge?: M[]) {
        if (!_.isArray(array)) {
            throw new Error(`${typeof array} is not a array`);
        }

        if (merge && merge.length) {
            merge.forEach((v: any) => array.push(v));
        }

        return array;
    }
}