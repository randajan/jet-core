
import "./class/extra/Promise";
import { _arr } from "./class/native/Array";
import { _bool } from "./class/native/Boolean";
import { _date } from "./class/native/Date";
import { _err } from "./class/native/Error";
import { _fn } from "./class/native/Function";
import { _map } from "./class/native/Map";
import { _num } from "./class/native/Number";
import { _obj } from "./class/native/Object";
import { _rgx } from "./class/native/RegExp";
import { _set } from "./class/native/Set";
import { _str } from "./class/native/String";
import { _sym } from "./class/native/Symbol";

const pass = async v=>v;

_arr.defineTo("prom", pass);
_bool.defineTo("prom", pass);
_date.defineTo("prom", pass);
_err.defineTo("prom", async err =>{ throw err; });
_fn.defineTo("prom", async (fn, ...args) => await fn(...args));
_map.defineTo("prom", pass);
_num.defineTo("prom", pass);
_obj.defineTo("prom", pass);
_rgx.defineTo("prom", pass);
_set.defineTo("prom", pass);
_str.defineTo("prom", pass);
_sym.defineTo("prom", pass);

export * from "./sync";