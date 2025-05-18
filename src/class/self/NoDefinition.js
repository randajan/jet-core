import { NoType } from "./NoType";

export class NoDefinition {
    constructor() {
        this.type = new NoType();

        this.to = new Map([
            ["obj", any=>({...any})],
            ["str", any=>any == null ? "" : String(any)],
        ]);
    }
}