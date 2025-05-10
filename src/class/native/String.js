import Ł, { jet } from "../../defs";

const boolPats = /^(0*|f|(no?t?)|off|false|undefined|null|NaN)$/i;

const hidePats = {
    point: "•", cross: "×", flake: "☀", draft: "⌭", power: "⚡", star: "★", skull: "☠", card: "♠♥♦♣", notes: "♩♪♫♬♭♮♯", chess: "♔♕♖♗♘♙♚♛♜♝♞♟",
    block: "▖▗▘▙▚▛▜▝▞▟", bar: "│║ ▌▐█", iting: "☰☱☲☳☴☵☶☷", astro: "♈♉♊♋♌♍♎♏♐♑♒♓", die: "⚀⚁⚂⚃⚄⚅",
    runic: "ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛠᛡᛢᛣᛤᛥᛦᛨᛩᛪᛮᛯᛰ",
    dots: "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿"
}

const deloneMap = {
    to: "aaccdeeillnooorstuuuyrzzAACCDEEILLNOOORSTUUUYRZZ",
    from: "áäčćďéěíĺľňóôöŕšťúůüýřžźÁÄČĆĎÉĚÍĹĽŇÓÔÖŔŠŤÚŮÜÝŘŽŹ"
};

const fight = (str1, str2) => {
    str1 = str1 == null ? "" : String(str1), str2 = str2 == null ? "" : String(str2);
    for (let i = 0; true; i++) {
        const s1 = str1[i], s2 = str2[i];
        if (!s1 || !s2) { return !s1; } else if (s1 === s2) { continue; }
        const d1 = Ł.str.delone(s1), d2 = Ł.str.delone(s2);
        if (d1 === d2) { return (s1.charCodeAt(0) || 0) < (s2.charCodeAt(0) || 0); }
        const l1 = d1.toLowerCase(), l2 = d2.toLowerCase();
        if (l1 === l2) { return (d1.charCodeAt(0) || 0) < (d2.charCodeAt(0) || 0); }
        return (l1.charCodeAt(0) || 0) < (l2.charCodeAt(0) || 0);
    }
}

jet.define("str", {
    self: String,
    create: any => any == null ? "" : String(any),
    rnd: (min, max, sqr) => { //HOW TO GENERATE GREAT RANDOM STRING???
        const c = ["bcdfghjklmnpqrstvwxz", "aeiouy"], p = c[0].length / (c[0].length + c[1].length);
        const l = Ł.num.rnd(Math.max(min, 2), max, sqr);
        let s = Ł.bool.rnd(p), r = "";
        while (r.length < l) { r += jet.getRnd(c[+(s = !s)]); }
        return r;
    },
}).defineTo({
    fn: str => _ => str,
    bool: str => !boolPats.test(str.trim()),
    arr: (str, comma) => str ? str.split(comma) : [],
    obj: str => jet.json.from(str),
    prom: async str => str,
    num: (str, strict) => {
        if (!str) { return 0; } else if (strict) { return Number(str); }
        const match = String(str).replace(/\u00A0/g, ' ').match(Ł.rgx.lib.number);
        if (!match || !match[0]) { return 0; }
        return Number(match[0].replaceAll(" ", "").replace(",", ".")) || 0;
    }
}).extend({
    isNumeric: str => !isNaN(Number(str)),
    capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),
    camelCase: str => str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ").map((s, i) => i ? Ł.str.capitalize(s) : s).join(""),
    pascalCase: str => str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ").map(s => Ł.str.capitalize(s)).join(""),
    snakeCase: str => str.replace(/[^a-zA-Z0-9]+/g, " ").trim().replaceAll(" ", "_"),
    delone: str => {
        let r = "";
        for (let v of str) { let x = deloneMap.from.indexOf(v); r += (x >= 0 ? deloneMap.to[x] : v); }
        return r;
    },
    efface: (str, remove) => str.replaceAll(remove, "").replace(/[\s\n\r]+/g, " ").trim(),
    simplify: (str, remove) => Ł.str.delone(Ł.str.efface(str, remove)).toLowerCase(),
    fight: (str1, str2, asc = true) => (fight(str1, str2) === asc) ? str1 : str2,
    carret: (str, pos) => Ł.num.frame(Ł.num.tap(pos, str.length), 0, str.length),
    quote: (str, quoteLeft = "'", quoteRight = "'") => str ? quoteLeft + str + quoteRight : "",
    splice: (str, index, howmany, ...strs) => {
        const s = Ł.str.carret(str, index), m = Ł.num.frame(howmany, 0, str.length - s);
        return str.slice(0, s) + Ł.str.to(strs, "") + str.slice(s + m);
    },
    hide: (str, pat, whitespace) => {
        if (!str) { return str; } var r = "", s = str, p = hidePats[pat] || pat || "•", w = (whitespace === false);
        for (var i = 0; i < str.length; i++) { r += (w && (s[i] === "\n" || s[i] === " ")) ? s[i] : p.length - 1 ? jet.getRnd(p) : p; }
        return r;
    },
    bite: (str, separator) => {
        const x = str.indexOf(separator);
        return x <= 0 ? ["", str] : [str.slice(0, x), str.slice(x + separator.length)];
    },
    uid: (length = 12, pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") => {
        let r = ""; pattern = Ł.str.to(pattern) || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        while (r.length < length) { r += jet.getRnd(pattern); }
        return r;
    },
    levenshtein: (s0, s1, blend) => {
        var s = ((blend === false) ? [s0, s1] : [Ł.str.simplify(s0, blend), Ł.str.simplify(s1, blend)]);
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
    mutate: (str, factor) => {
        var r = [], n = str.length / 2, m = str.length * 2, f = Math.abs(1000 * (factor || 1));
        while (r.length < f) { var s = Ł.str.rnd(n, m); r.push([s, Ł.str.levenshtein(s, str)]); }
        return r.sort((a, b) => b[1] - a[1])[0][0];
    }
})