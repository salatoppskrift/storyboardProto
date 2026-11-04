console.clear();

type Order = { price: number, qty: number, vat: number }
const createRandomOrderArr = () => Array.from({ length: 4 },
    () => ({
        price: Math.floor(Math.random() * 2000) + 99,
        qty: Math.floor(Math.random() * 60),
        vat: (Math.floor(Math.random() * 9900) + 100) / 100,
    }) satisfies Order
)

const orders: Order[] = [{
    price: 389,
    qty: 2,
    vat: 94.54
}, {
    price: 1750,
    qty: 42,
    vat: 90.27
}, {
    price: 1262,
    qty: 38,
    vat: 13.64
}, {
    price: 418,
    qty: 29,
    vat: 58.07
}];

const ordersAsJson = JSON.stringify(orders);

const wrongJsons = [
    '[{"price":"389","qty":2,"vat":94.54},{"price":1750,"qty":42,"vat":90.27},{"price":1262,"qty":38,"vat":13.64},{"price":418,"qty":29,"vat":58.07}]'
]

console.log(tryParseJson(wrongJsons[0])
    .flatMap(readOrder)
    .flatMap(validateOrder)
    .flatMap(calcAndFormat)
    ?? "Ugyldig format."
)

function parseNumberStrict(x: unknown): number[] {
    if (typeof x === "number") return Number.isFinite(x) ? [x] : [];
    if (typeof x === "string") {
        const s = x.trim();
        if (!s || s.includes(",") || s.includes("%")) return [];
        const n = Number(s);
        return Number.isFinite(n) ? [n] : [];
    }
    return [];
};
function tryParseJson(s: string): any[] {
    try {
        const obj = JSON.parse(s);
        const isObj =
            obj !== null
            && typeof obj === "object"
            && Array.isArray(obj);
        return isObj ? obj : [];
    } catch { return []; }
};

function validateOrder(o: Order): Order[] {
    const ok = o.price >= 0
        && Number.isInteger(o.qty)
        && o.qty > 0
        && o.vat >= 0
        && o.vat <= 100;
    return ok ? [o] : [];
}

function readOrder(o: Order) {
    if (!o.price || !o.qty || !o.vat) return [];
    const p = parseNumberStrict(o.price);
    const q = parseNumberStrict(o.qty);
    const v = parseNumberStrict(o.vat);

    if (p.length === 0 || q.length === 0 || v.length === 0) return [];
    return [{ price: p[0], qty: q[0], vat: v[0] }];
}

function calcAndFormat(o: Order): string[] {
    const net = o.price * o.qty;
    const gross = net * (1 + o.vat / 100);
    if (!Number.isFinite(net) || !Number.isFinite(gross)) return [];
    const formatted = gross.toFixed(2);

    return [`
        Pris: ${o.price}
        Antall: ${o.qty}
        MVA (%): ${o.vat}
        Netto: ${net.toFixed(2)}
        Brutto: ${formatted}
    `]
};

function run(raw: string): string {
    return tryParseJson(raw)
        .flatMap(readOrder)
        .flatMap(validateOrder)
        .flatMap(calcAndFormat)[0] ?? "Feil: Ugyldig input";
};


