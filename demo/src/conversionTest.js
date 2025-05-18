// jetConversionMatrixTest.js
// Massive conversion test between multiple sample values using @randajan/jet.
// Run with:   node jetConversionMatrixTest.js
// Make sure @randajan/jet is installed (npm i @randajan/jet)


export const conversionTest = () => {

  // ---------------------------------------------------------------------------
  // 1) Samples to test – extend freely
  // ---------------------------------------------------------------------------
  const samples = {
    arr: [1, 2, 3],
    fn: () => 'fn',
    obj: { a: 1 },
    str: 'hello',
    bol: true,
    date: new Date('2025-05-18T00:00:00Z'),
    err: new Error('boom'),
    map: new Map([['k', 1]]),
    num: 123,
    rgx: /foo/gi,
    set: new Set([1, 2]),
    sym: Symbol('sym')
  };

  // ---------------------------------------------------------------------------
  // 2) Helper – terse, safe, platform‑neutral representation (≤ 60 chars)
  // ---------------------------------------------------------------------------
  function repr(val) {
    if (val === null) return 'null';

    const t = typeof val;
    if (t === 'string') return val.length > 60 ? '"' + val.slice(0, 57) + '…"' : '"' + val + '"';
    if (t === 'number' || t === 'boolean' || t === 'undefined') return String(val);
    if (t === 'function') return `[Function${val.name ? ' ' + val.name : ''}]`;
    if (t === 'symbol') return val.toString();

    if (val instanceof RegExp || val instanceof Date || val instanceof Error) return val.toString();
    if (val instanceof Map) {
      const entries = Array.from(val.entries()).slice(0, 3).map(([k, v]) => `${repr(k)}⇒${repr(v)}`);
      return `Map(${entries.join(', ')}${val.size > 3 ? ', …' : ''})`;
    }
    if (val instanceof Set) {
      const items = Array.from(val.values()).slice(0, 3).map(repr);
      return `Set(${items.join(', ')}${val.size > 3 ? ', …' : ''})`;
    }

    // Arrays & plain objects – fallback to JSON.stringify (may fail on circular)
    try {
      const json = JSON.stringify(val);
      return json.length > 60 ? json.slice(0, 57) + '…' : json;
    } catch (_) {
      return Object.prototype.toString.call(val);
    }
  }

  // ---------------------------------------------------------------------------
  // 3) Run all conversions
  // ---------------------------------------------------------------------------
  const summaryTable = [];
  const detailedRows = [];

  for (const [fromKey, value] of Object.entries(samples)) {
    const summaryRow = { FROM: fromKey.toUpperCase() };

    for (const toKey of Object.keys(samples)) {
      try {
        const converted = jet[toKey].to(value);
        summaryRow[toKey.toUpperCase()] = '✓';

        detailedRows.push({
          FROM: fromKey,
          TO: toKey,
          INPUT: repr(value),
          OUTPUT: repr(converted),
          ERROR: ''
        });
      } catch (e) {
        summaryRow[toKey.toUpperCase()] = '×';

        detailedRows.push({
          FROM: fromKey,
          TO: toKey,
          INPUT: repr(value),
          OUTPUT: '',
          ERROR: e instanceof Error ? e.message : String(e)
        });
      }
    }
    summaryTable.push(summaryRow);
  }

  // ---------------------------------------------------------------------------
  // 4) Print results (both Node & browser support console.table)
  // ---------------------------------------------------------------------------
  console.log('\n=== KONVERZNÍ MATICE (✓/×) ===');
  console.table(summaryTable);

  console.log('\n=== PODROBNÉ VÝSLEDKY (INPUT / OUTPUT) ===');
  console.table(detailedRows);

  // ---------------------------------------------------------------------------
  // 5) (Optional) Export results – uncomment if needed
  // ---------------------------------------------------------------------------
  // if (typeof window === 'undefined') {
  //   // Node.js – write JSON to disk
  //   import { writeFileSync } from 'node:fs';
  //   writeFileSync('conversion-details.json', JSON.stringify(detailedRows, null, 2));
  // }

}

