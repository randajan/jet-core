import { Unknown } from "./Unknown";

export class Undefined {
    constructor() {
        this.type = new Unknown();
        this.to = new Map([
            ["*", any=>({...any})],
            ["str", any=>String(any)],
        ]);
    }
}