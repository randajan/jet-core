import { jet }from "../../defs";
import { solid, virtual, safe } from "@randajan/props";


class Ticker {

    static create(cfg={}) {
        return new Ticker(cfg);
    }

    constructor({ onTick, onInit, onStart, onStop, interval }) {

        onInit = jet.isRunnable(onInit) ? onInit : _=>{};
        onTick = jet.isRunnable(onTick) ? onTick : _=>{};
        onStart = jet.isRunnable(onStart) ? onStart : _=>{};
        onStop = jet.isRunnable(onStop) ? onStop : _=>{};

        const _p = {
            state:false,
            interval:0,
            count:0,
            intervalId:null
        };

        const tick = async _=>{
            if (!_p.state) { return; }
            _p.count ++;
            try { await onTick(this); } catch(err) {}
            _p.intervalId = setTimeout(tick, _p.interval);
        }

        const start = async _=>{
            if (!_p.count) { await onInit(this); }
            await onStart(this);
            await tick();
        }

        safe(this, _p, "state", (t, f)=>{
            t = Boolean.jet.to(t);
            if (t === f) { return f; }
            if (t) { start(); }
            else { clearTimeout(_p.intervalId); }
            return t;
        });

        safe(this, _p, "interval", (t, f)=>{
            t = Math.max(0, Number.jet.to(t));
            if (t === f) { return f; }
            if (!_p.state) { return t; }
            clearTimeout(_p.intervalId);
            setTimeout(tick, t);
            return t;
        });
        
        solid(this, "resetCounter", _=>{ _p.count = 0; return this; });

        virtual(this, "count", _=>_p.count);

        this.setInterval(interval);

    }

    start() { this.state = true; return this; }
    stop() { this.state = false; return this; }

    restart() {  return this.stop().resetCounter().start(); }

    setInterval(interval) { this.interval = interval; return this; }

}

export default jet.define("Ticker", { self:Ticker });