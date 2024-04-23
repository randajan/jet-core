class Plex extends Function {

    static extend(self, props={}) {
        for (let i in props) {
            Object.defineProperty(self, i, {value:props[i], enumerable:true});
        }
        return self;
    }

    constructor(fce, props={}) {
        super();
        return Plex.extend(Object.setPrototypeOf(fce ? fce.bind() : this, new.target.prototype), props);
    }
}

export default Plex;