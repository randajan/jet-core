
import jet from "../jet";

const hidePats = {
    point:"•", cross:"×", flake:"☀", draft:"⌭", power:"⚡", star:"★", skull:"☠", card:"♠♥♦♣", notes:"♩♪♫♬♭♮♯", chess:"♔♕♖♗♘♙♚♛♜♝♞♟",
    block:"▖▗▘▙▚▛▜▝▞▟", bar:"│║ ▌▐█", iting:"☰☱☲☳☴☵☶☷", astro:"♈♉♊♋♌♍♎♏♐♑♒♓", die:"⚀⚁⚂⚃⚄⚅",
    runic:"ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛠᛡᛢᛣᛤᛥᛦᛨᛩᛪᛮᛯᛰ",
    dots:"⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿"
}

const deloneMap = {
    to:"aaccdeeillnooorstuuuyrzzAACCDEEILLNOOORSTUUUYRZZ",
    from:"áäčćďéěíĺľňóôöŕšťúůüýřžźÁÄČĆĎÉĚÍĹĽŇÓÔÖŔŠŤÚŮÜÝŘŽŹ"
};

const fight = (str1, str2)=>{
    str1 = str1 == null ? "" : String(str1), str2 = str2 == null ? "" : String(str2);
    for (let i=0; true; i++) {
        const s1 = str1[i], s2 = str2[i];
        if (!s1 || !s2) { return !s1; } else if (s1 === s2) { continue; }
        const d1 = String.jet.delone(s1), d2 = String.jet.delone(s2);
        if (d1 === d2) { return (s1.charCodeAt(0) || 0) < (s2.charCodeAt(0) || 0); }
        const l1 = d1.toLowerCase(), l2 = d2.toLowerCase();
        if (l1 === l2) { return (d1.charCodeAt(0) || 0) < (d2.charCodeAt(0) || 0); }
        return (l1.charCodeAt(0) || 0) < (l2.charCodeAt(0) || 0);
    }
}

export default jet.define("String", String, {
    create:any=>any == null ? "" : String(any),
    rnd:(min, max, sqr)=>{ //HOW TO GENERATE GREAT RANDOM STRING???
        const c = ["bcdfghjklmnpqrstvwxz", "aeiouy"], p = c[0].length/(c[0].length+c[1].length);
        const l = Number.jet.rnd(Math.max(min, 2), max, sqr);
        let s = Boolean.jet.rnd(p), r = "";
        while (r.length < l) {r += jet.getRND(c[+(s = !s)]);}
        return r;
    },
    to:{
        Function:str=>_=>str,
        Boolean:str=>!["0", "false", "null", "undefined", "NaN"].includes(str.toLowerCase()),
        Array:(str, comma)=>str ? str.split(comma) : [],
        Object:str=>jet.json.from(str),
        Promise:async str=>str,
        Number:(str, strict)=>{
            if (!str) { return 0; } else if (strict) { return Number(str); }
            const match = String(str).replace(/\u00A0/g, ' ').match(RegExp.jet.lib.number);
            if (!match || !match[0]) { return 0; }
            return Number(match[0].replaceAll(" ", "").replace(",", ".")) || 0;
        }
    },
    extend:{
        isNumeric: str=>!isNaN(Number(str)),
        lower: str=>str.toLowerCase(),
        upper: str=>str.toUpperCase(),
        capitalize: str=>str.charAt(0).toUpperCase() + str.slice(1),
        camelCase: str=>str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ").map((s, i)=>i ? String.jet.capitalize(s) : s).join(""),
        pascalCase: str=>str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ").map(s=>String.jet.capitalize(s)).join(""),
        snakeCase:str=>str.replace(/[^a-zA-Z0-9]+/g, " ").trim().replaceAll(" ", "_"),
        delone: str=>{
            let r = "";
            for (let v of str) { let x = deloneMap.from.indexOf(v); r += (x >= 0 ? deloneMap.to[x] : v); }
            return r;
        },
        efface: (str, remove)=>str.replaceAll(remove, "").replace(/[\s\n\r]+/g, " ").trim(),
        simplify: (str, remove)=>String.jet.delone(String.jet.efface(str, remove)).toLowerCase(),
        fight: (str1, str2, asc=true)=>(fight(str1, str2) === asc) ? str1 : str2,
        carret: (str, pos)=>Number.jet.tap(pos, str.length).frame(0, str.length),
        quote: (str, quoteLeft="'", quoteRight="'")=>str ? quoteLeft+str+quoteRight : "",
        splice: (str, index, howmany, ...strs)=>{
            const s = String.jet.carret(str, index), m = Number.jet.frame(howmany, 0, str.length-s); 
            return str.slice(0, s) + String.jet.to(strs, "") + str.slice(s+m);
        },
        hide: (str, pat, whitespace)=>{
            if (!str) { return str; } var r = "", s = str, p = hidePats[pat] || pat || "•", w = (whitespace === false);
            for (var i = 0; i < str.length; i++) { r += (w && (s[i] === "\n" || s[i] === " ")) ? s[i] : p.length - 1 ? jet.getRND(p) : p; }
            return r;
        },
        bite: (str, separator)=>{
            const x = str.indexOf(separator);
            return x <= 0 ? ["", str] : [str.slice(0, x), str.slice(x + separator.length)];
        },
        levenshtein: (s0, s1, blend)=>{
            var s = ((blend === false) ? [s0, s1] : [String.jet.simplify(s0, blend), String.jet.simplify(s1, blend)]);
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
            while (r.length < f) { var s = String.jet.rnd(n, m); r.push([s, String.jet.levenshtein(s, str)]); }
            return r.sort((a, b)=>b[1] - a[1])[0][0];
        }
    }
});