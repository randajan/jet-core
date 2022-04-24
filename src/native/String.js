
import jet from "../jet";

const hidePats = {
    point:"•", cross:"×", flake:"☀", draft:"⌭", power:"⚡", star:"★", skull:"☠", card:"♠♥♦♣", notes:"♩♪♫♬♭♮♯", chess:"♔♕♖♗♘♙♚♛♜♝♞♟",
    block:"▖▗▘▙▚▛▜▝▞▟", bar:"│║ ▌▐█", iting:"☰☱☲☳☴☵☶☷", astro:"♈♉♊♋♌♍♎♏♐♑♒♓", die:"⚀⚁⚂⚃⚄⚅",
    runic:"ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛠᛡᛢᛣᛤᛥᛦᛨᛩᛪᛮᛯᛰ",
    dots:"⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿"
}

export default jet.define("String", String, {
    create:any=>any == null ? "" : String(any),
    rnd:(min, max, sqr)=>{ //HOW TO GENERATE GREAT RANDOM STRING???
        const c = ["bcdfghjklmnpqrstvwxz", "aeiouy"], p = c[0].length/(c[0].length+c[1].length);
        const l = Number.jet.rnd(Math.max(min, 2), max, sqr);
        let s = Boolean.jet.rnd(p), r = "";
        while (r.length < l) {r += jet.childRnd(c[+(s = !s)]);}
        return r;
    },
    to:{
        Function:str=>_=>str,
        Boolean:str=>!["0", "false", "null", "undefined", "NaN"].includes(str.toLowerCase()),
        Array:(str, comma)=>str.split(comma),
        Object:str=>jet.json.from(str),
        Promise:async str=>str,
        Number:(str, strict)=>{
            if (!str) { return 0; } else if (strict) { return Number(str); }
            const match = String(str).replace(/\u00A0/g, ' ').match(RegExp.jet.lib.number);
            if (!match || !match[0]) { return 0; }
            return Number(match[0].replaceAll(" ", "").replace(",", ".")) || 0;
        }
    },
    extendPrototype:{
        isNumeric: str=>!isNaN(Number(str)),
        lower: str=>str.toLowerCase(),
        upper: str=>str.toUpperCase(),
        capitalize: str=>str.charAt(0).jet.upper() + str.slice(1),
        delone: str=>{
            let r = "", to = "aaccdeeillnooorstuuuyrzzAACCDEEILLNOOORSTUUUYRZZ", from = "áäčćďéěíĺľňóôöŕšťúůüýřžźÁÄČĆĎÉĚÍĹĽŇÓÔÖŔŠŤÚŮÜÝŘŽŹ";
            for (let v of str) { let x = from.indexOf(v); r += (x >= 0 ? to[x] : v); }
            return r;
        },
        efface: (str, remove)=>str.replaceAll(remove, "").replace(/[\s\n\r]+/g, " ").trim(),
        simplify: (str, remove)=>str.jet.efface(remove).jet.delone().jet.lower(),
        sort: (...strs)=>
            strs.map(v => { const s = String.jet.to(v), d = s.jet.delone(), l = d.jet.lower(); return {l, d, s} })
            .sort((m1, m2) => {
                for (let i=0; true; i++) {
                    for (let k in m1) {
                        let c1 = m1[k].charCodeAt(i) || 0, c2 = m2[k].charCodeAt(i) || 0;
                        if (c1 !== c2 || !c1) { return c1 - c2; }
                    }
                }
            })
            .map(m=>m.s)
        ,
        fight: (...strs)=>String.jet.sort(...strs)[0],
        carret: (str, pos)=>Number.jet.tap(pos, str.length).frame(0, str.length),
        splice: (str, index, howmany, ...strs)=>{
            const s = str.jet.carret(index), m = Number.jet.frame(howmany, 0, str.length-s); 
            return str.slice(0, s) + String.jet.to(strs, "") + str.slice(s+m);
        },
        hide: (str, pat, whitespace)=>{
            if (!str) { return str; } var r = "", s = str, p = hidePats[pat] || pat || "•", w = (whitespace === false);
            for (var i = 0; i < str.length; i++) { r += (w && (s[i] === "\n" || s[i] === " ")) ? s[i] : p.length - 1 ? jet.childRnd(p) : p; }
            return r;
        },
        levenshtein: (s0, s1, blend)=>{
            var s = ((blend === false) ? [s0, s1] : [s0.jet.simplify(blend), String.jet.simplify(s1, blend)]);
            if (s[0] === s[1]) { return 1; } else if (!s[0] || !s[1]) { return 0; }
            var l = [s[0].length, s[1].length], c = []; if (l[1] > l[0]) { l.reverse(); s.reverse(); }
            for (var i = 0; i <= l[0]; i++) {
                var oV = i; for (var j = 0; j <= l[1]; j++) {
                    if (i === 0) { c[j] = j; } else if (j > 0) {
                        var nV = c[j - 1];
                        if (s[0].charAt(i - 1) !== s[1].charAt(j - 1)) { nV = Math.min(Math.min(nV, oV), c[j]) + 1; } c[j - 1] = oV; oV = nV;
                    }
                } if (i > 0) { c[l[1]] = oV; }
            }
            return (l[0] - c[l[1]]) / parseFloat(l[0]);
        },
        mutate: (str, factor)=>{
            var r = [], n = str.length / 2, m = str.length * 2, f = Math.abs(1000 * (factor || 1));
            while (r.length < f) { var s = String.jet.rnd(n, m); r.push([s, s.jet.levenshtein(str)]); }
            return r.sort((a, b)=>b[1] - a[1])[0][0];
        }
    }
});