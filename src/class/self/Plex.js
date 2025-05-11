
export class Plex extends Function {
    constructor(fce) {
        super();
        return Object.setPrototypeOf(fce ? fce.bind() : this, new.target.prototype);
    }
}