import { jet }from "../../defs";
import { solids } from "@randajan/props";

class Plex extends Function {
    constructor(fce, props={}) {
        super();
        return solids(Object.setPrototypeOf(fce ? fce.bind() : this, new.target.prototype), props);
    }
}

export default jet.define("Plex", {
    self:Plex,
    copy:x=>Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys:x=>Object.keys(x),
    vals:x=>Object.values(x),
    entries:x=>Object.entries(x)
});