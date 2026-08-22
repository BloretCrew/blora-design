/**
 * Byte-mode QR encoder (ISO/IEC 18004). Versions 1–40, levels L/M/Q/H.
 * Default error correction is M.
 */

export type QrEcLevel = "L" | "M" | "Q" | "H";

const EC_INDEX: Record<QrEcLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };

/** [dataCodewords, ecPerBlock, group1Blocks, group1Data, group2Blocks] per level L-M-Q-H, versions 1–40. */
const RS_TABLE: number[][][] = [
  [
    [19, 7, 1, 19, 0],
    [16, 10, 1, 16, 0],
    [13, 13, 1, 13, 0],
    [9, 17, 1, 9, 0],
  ],
  [
    [34, 10, 1, 34, 0],
    [28, 16, 1, 28, 0],
    [22, 22, 1, 22, 0],
    [16, 28, 1, 16, 0],
  ],
  [
    [55, 15, 1, 55, 0],
    [44, 26, 1, 44, 0],
    [34, 18, 2, 17, 0],
    [26, 22, 2, 13, 0],
  ],
  [
    [80, 20, 1, 80, 0],
    [64, 18, 2, 32, 0],
    [48, 26, 2, 24, 0],
    [36, 16, 4, 9, 0],
  ],
  [
    [108, 26, 1, 108, 0],
    [86, 24, 2, 43, 0],
    [62, 18, 2, 15, 2],
    [46, 22, 2, 11, 2],
  ],
  [
    [136, 18, 2, 68, 0],
    [108, 16, 4, 27, 0],
    [76, 24, 4, 19, 0],
    [60, 28, 4, 15, 0],
  ],
  [
    [156, 20, 2, 78, 0],
    [124, 18, 4, 31, 0],
    [88, 18, 2, 14, 4],
    [66, 26, 4, 13, 1],
  ],
  [
    [194, 24, 2, 97, 0],
    [154, 22, 2, 38, 2],
    [110, 22, 4, 18, 2],
    [86, 26, 4, 14, 2],
  ],
  [
    [232, 30, 2, 116, 0],
    [182, 22, 3, 36, 2],
    [132, 20, 4, 16, 4],
    [100, 24, 4, 12, 4],
  ],
  [
    [274, 18, 2, 68, 2],
    [216, 26, 4, 43, 1],
    [154, 24, 6, 19, 2],
    [122, 28, 6, 15, 2],
  ],
  [
    [324, 20, 4, 81, 0],
    [254, 30, 1, 50, 4],
    [180, 28, 4, 22, 4],
    [140, 24, 3, 12, 8],
  ],
  [
    [370, 24, 2, 92, 2],
    [290, 22, 6, 36, 2],
    [206, 26, 4, 20, 6],
    [158, 28, 7, 14, 4],
  ],
  [
    [428, 26, 4, 107, 0],
    [334, 22, 8, 37, 1],
    [244, 24, 8, 20, 4],
    [180, 22, 12, 11, 4],
  ],
  [
    [461, 30, 3, 115, 1],
    [365, 24, 4, 40, 5],
    [261, 20, 11, 16, 5],
    [197, 24, 11, 12, 5],
  ],
  [
    [523, 22, 5, 87, 1],
    [415, 24, 5, 41, 5],
    [295, 30, 5, 24, 7],
    [223, 24, 11, 12, 7],
  ],
  [
    [589, 24, 5, 98, 1],
    [453, 28, 7, 45, 3],
    [325, 24, 15, 19, 2],
    [253, 30, 3, 15, 13],
  ],
  [
    [647, 28, 1, 107, 5],
    [507, 28, 10, 46, 1],
    [367, 28, 1, 22, 15],
    [283, 28, 2, 14, 17],
  ],
  [
    [721, 30, 5, 120, 1],
    [563, 26, 9, 43, 4],
    [397, 28, 17, 22, 1],
    [313, 28, 2, 14, 19],
  ],
  [
    [795, 28, 3, 113, 4],
    [627, 26, 3, 44, 11],
    [445, 26, 17, 21, 4],
    [341, 26, 9, 13, 16],
  ],
  [
    [861, 28, 3, 107, 5],
    [669, 26, 3, 41, 13],
    [485, 30, 15, 24, 5],
    [385, 28, 15, 15, 10],
  ],
  [
    [932, 28, 4, 116, 4],
    [714, 26, 17, 42, 0],
    [512, 28, 17, 22, 6],
    [406, 30, 19, 16, 6],
  ],
  [
    [1006, 28, 2, 111, 7],
    [782, 28, 17, 46, 0],
    [568, 30, 7, 24, 16],
    [442, 24, 34, 13, 0],
  ],
  [
    [1094, 30, 4, 121, 5],
    [860, 28, 4, 47, 14],
    [614, 30, 11, 24, 14],
    [464, 30, 16, 15, 14],
  ],
  [
    [1174, 30, 6, 117, 4],
    [914, 28, 6, 45, 14],
    [664, 30, 11, 24, 16],
    [514, 30, 30, 16, 2],
  ],
  [
    [1276, 26, 8, 106, 4],
    [1000, 28, 8, 47, 13],
    [718, 30, 7, 24, 22],
    [538, 30, 22, 15, 13],
  ],
  [
    [1370, 28, 10, 114, 2],
    [1062, 28, 19, 46, 4],
    [754, 28, 28, 22, 6],
    [596, 30, 33, 16, 4],
  ],
  [
    [1468, 30, 8, 122, 4],
    [1128, 28, 22, 45, 3],
    [808, 30, 8, 23, 26],
    [628, 30, 12, 15, 28],
  ],
  [
    [1531, 30, 3, 117, 10],
    [1193, 28, 3, 45, 23],
    [871, 30, 4, 24, 31],
    [661, 30, 11, 15, 31],
  ],
  [
    [1631, 30, 7, 116, 7],
    [1267, 28, 21, 45, 7],
    [911, 30, 1, 23, 37],
    [701, 30, 19, 15, 26],
  ],
  [
    [1735, 30, 5, 115, 10],
    [1373, 28, 19, 47, 10],
    [985, 30, 15, 24, 25],
    [745, 30, 23, 15, 25],
  ],
  [
    [1843, 30, 13, 115, 3],
    [1455, 28, 2, 46, 29],
    [1033, 30, 42, 24, 1],
    [793, 30, 23, 15, 28],
  ],
  [
    [1955, 30, 17, 115, 0],
    [1541, 28, 10, 46, 23],
    [1115, 30, 10, 24, 35],
    [845, 30, 19, 15, 35],
  ],
  [
    [2071, 30, 17, 115, 1],
    [1631, 28, 14, 46, 21],
    [1171, 30, 29, 24, 19],
    [901, 30, 11, 15, 46],
  ],
  [
    [2191, 30, 13, 115, 6],
    [1725, 28, 14, 46, 23],
    [1231, 30, 44, 24, 7],
    [961, 30, 59, 16, 1],
  ],
  [
    [2306, 30, 12, 121, 7],
    [1812, 28, 12, 47, 26],
    [1286, 30, 39, 24, 14],
    [986, 30, 22, 15, 41],
  ],
  [
    [2434, 30, 6, 121, 14],
    [1914, 28, 6, 47, 34],
    [1354, 30, 46, 24, 10],
    [1054, 30, 2, 15, 64],
  ],
  [
    [2566, 30, 17, 122, 4],
    [1992, 28, 29, 46, 14],
    [1426, 30, 49, 24, 10],
    [1096, 30, 24, 15, 46],
  ],
  [
    [2702, 30, 4, 122, 18],
    [2102, 28, 13, 46, 32],
    [1502, 30, 48, 24, 14],
    [1142, 30, 42, 15, 32],
  ],
  [
    [2812, 30, 20, 117, 4],
    [2216, 28, 40, 47, 7],
    [1582, 30, 43, 24, 22],
    [1222, 30, 10, 15, 67],
  ],
  [
    [2956, 30, 19, 118, 6],
    [2334, 28, 18, 47, 31],
    [1666, 30, 34, 24, 34],
    [1276, 30, 20, 15, 61],
  ],
];

const ALIGNMENT: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
];

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]!;
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a]! + LOG[b]!]!;
}

function rsGenerator(ec: number): number[] {
  let poly = [1];
  for (let i = 0; i < ec; i++) {
    const next = Array.from({ length: poly.length + 1 }, () => 0);
    for (let j = 0; j < poly.length; j++) {
      next[j] = (next[j] ?? 0) ^ (poly[j] ?? 0);
      next[j + 1] = (next[j + 1] ?? 0) ^ gfMul(poly[j] ?? 0, EXP[i]!);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, ec: number): Uint8Array {
  const gen = rsGenerator(ec);
  const res = new Uint8Array(data.length + ec);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i]!;
    if (!coef) continue;
    for (let j = 0; j < gen.length; j++) {
      const idx = i + j;
      res[idx] = (res[idx] ?? 0) ^ gfMul(gen[j] ?? 0, coef);
    }
  }
  return res.subarray(data.length);
}

function utf8Bytes(text: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 128) bytes.push(code);
    else if (code < 2048) bytes.push(192 | (code >> 6), 128 | (code & 63));
    else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(++i);
      const cp = 0x10000 + ((code & 0x3ff) << 10) + (next & 0x3ff);
      bytes.push(
        240 | (cp >> 18),
        128 | ((cp >> 12) & 63),
        128 | ((cp >> 6) & 63),
        128 | (cp & 63),
      );
    } else bytes.push(224 | (code >> 12), 128 | ((code >> 6) & 63), 128 | (code & 63));
  }
  return bytes;
}

function lengthBits(version: number): number {
  if (version <= 9) return 8;
  if (version <= 26) return 16;
  return 16;
}

function bitWriter() {
  const bits: number[] = [];
  return {
    bits,
    write(value: number, width: number) {
      for (let i = width - 1; i >= 0; i--) bits.push((value >> i) & 1);
    },
    toCodewords(count: number): Uint8Array {
      const pad = [0xec, 0x11];
      let p = 0;
      while (bits.length + 8 <= count * 8) {
        const byte = pad[p++ % 2]!;
        for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
      }
      while (bits.length < count * 8) bits.push(0);
      const out = new Uint8Array(count);
      for (let n = 0; n < count; n++) {
        let v = 0;
        for (let b = 0; b < 8; b++) v = (v << 1) | bits[n * 8 + b]!;
        out[n] = v;
      }
      return out;
    },
  };
}

function pickVersion(byteLen: number, level: QrEcLevel): number {
  const li = EC_INDEX[level];
  for (let v = 1; v <= 40; v++) {
    const capBits = RS_TABLE[v - 1]![li]![0]! * 8;
    if (4 + lengthBits(v) + byteLen * 8 <= capBits) return v;
  }
  throw new Error("QR_TOO_LONG");
}

const EC_FORMAT: Record<QrEcLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };

function formatBits(level: QrEcLevel, mask: number): number {
  const data = (EC_FORMAT[level] << 3) | mask;
  let rem = data << 10;
  for (let i = 14; i >= 10; i--) if (rem & (1 << i)) rem ^= 0x537 << (i - 10);
  return ((data << 10) | rem) ^ 0x5412;
}

function versionBits(version: number): number {
  let rem = version << 12;
  for (let i = 17; i >= 12; i--) if (rem & (1 << i)) rem ^= 0x1f25 << (i - 12);
  return (version << 12) | rem;
}

function isFinder(r: number, c: number, size: number): boolean {
  const inFinder = (fr: number, fc: number) => r >= fr && r < fr + 7 && c >= fc && c < fc + 7;
  return inFinder(0, 0) || inFinder(0, size - 7) || inFinder(size - 7, 0);
}

function placeFinders(m: (number | null)[][], size: number): void {
  const paint = (sr: number, sc: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = sr + r;
        const cc = sc + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const on =
          r === -1 ||
          c === -1 ||
          r === 7 ||
          c === 7 ||
          (r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        m[rr]![cc] = on ? 1 : 0;
      }
    }
  };
  paint(0, 0);
  paint(0, size - 7);
  paint(size - 7, 0);
}

function placeTiming(m: (number | null)[][], size: number): void {
  for (let i = 8; i < size - 8; i++) {
    if (m[6]![i] == null) m[6]![i] = i % 2 === 0 ? 1 : 0;
    if (m[i]![6] == null) m[i]![6] = i % 2 === 0 ? 1 : 0;
  }
}

function placeAlign(m: (number | null)[][], version: number): void {
  const pos = ALIGNMENT[version] ?? [];
  for (const r of pos) {
    for (const c of pos) {
      if (isFinder(r, c, m.length)) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const on = dr === -2 || dr === 2 || dc === -2 || dc === 2 || (dr === 0 && dc === 0);
          m[r + dr]![c + dc] = on ? 1 : 0;
        }
      }
    }
  }
}

function reserveFormat(m: (number | null)[][], size: number): void {
  for (let i = 0; i < 9; i++) {
    if (m[8]![i] == null) m[8]![i] = 0;
    if (m[i]![8] == null) m[i]![8] = 0;
  }
  for (let i = 0; i < 8; i++) {
    if (m[8]![size - 1 - i] == null) m[8]![size - 1 - i] = 0;
    if (m[size - 1 - i]![8] == null) m[size - 1 - i]![8] = 0;
  }
  m[size - 8]![8] = 1;
}

function placeVersion(m: (number | null)[][], version: number): void {
  if (version < 7) return;
  const bits = versionBits(version);
  const size = m.length;
  for (let i = 0; i < 18; i++) {
    const bit = (bits >> i) & 1;
    const r = Math.floor(i / 3);
    const c = i % 3;
    m[r]![size - 11 + c] = bit;
    m[size - 11 + c]![r] = bit;
  }
}

function maskAt(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    default:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
  }
}

function placeData(m: (number | null)[][], data: Uint8Array, mask: number): void {
  const size = m.length;
  let bit = 0;
  const total = data.length * 8;
  let dir = -1;
  let col = size - 1;
  while (col > 0) {
    if (col === 6) col--;
    for (let i = 0; i < size; i++) {
      const r = dir < 0 ? size - 1 - i : i;
      for (let k = 0; k < 2; k++) {
        const c = col - k;
        if (m[r]![c] != null) continue;
        const v = bit < total ? (data[bit >> 3]! >> (7 - (bit & 7))) & 1 : 0;
        bit++;
        m[r]![c] = maskAt(mask, r, c) ? v ^ 1 : v;
      }
    }
    dir = -dir;
    col -= 2;
  }
}

function paintFormat(m: (number | null)[][], bits: number): void {
  const size = m.length;
  const seq = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8],
  ];
  for (let i = 0; i < 15; i++) {
    const bit = (bits >> (14 - i)) & 1;
    m[seq[i]![0]!]![seq[i]![1]!] = bit;
  }
  for (let i = 0; i < 8; i++) m[8]![size - 1 - i] = (bits >> (14 - i)) & 1;
  for (let i = 0; i < 7; i++) m[size - 1 - i]![8] = (bits >> (6 - i)) & 1;
}

function penalty(m: number[][]): number {
  const size = m.length;
  let score = 0;
  const run = (get: (i: number) => number) => {
    let last = get(0);
    let n = 1;
    for (let i = 1; i <= size; i++) {
      const v = i < size ? get(i) : -1;
      if (v === last) n++;
      else {
        if (n >= 5) score += 3 + (n - 5);
        last = v;
        n = 1;
      }
    }
  };
  for (let r = 0; r < size; r++) run((c) => m[r]![c]!);
  for (let c = 0; c < size; c++) run((r) => m[r]![c]!);
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = m[r]![c]!;
      if (v === m[r]![c + 1]! && v === m[r + 1]![c]! && v === m[r + 1]![c + 1]!) score += 3;
    }
  }
  const dark = m.flat().reduce((a, b) => a + b, 0);
  score += Math.abs(Math.floor((dark * 100) / (size * size) / 5) * 5 - 50) / 5;
  return score;
}

function interleave(version: number, level: QrEcLevel, data: Uint8Array): Uint8Array {
  const [totalData, ecPer, g1, g1data, g2] = RS_TABLE[version - 1]![EC_INDEX[level]]!;
  const blocks: { data: Uint8Array; ec: Uint8Array }[] = [];
  let offset = 0;
  for (let i = 0; i < g1!; i++) {
    const slice = data.subarray(offset, offset + g1data!);
    offset += g1data!;
    blocks.push({ data: slice, ec: rsEncode(slice, ecPer!) });
  }
  const g2data = g1data! + 1;
  for (let i = 0; i < g2!; i++) {
    const slice = data.subarray(offset, offset + g2data);
    offset += g2data;
    blocks.push({ data: slice, ec: rsEncode(slice, ecPer!) });
  }
  const out = new Uint8Array(totalData! + blocks.length * ecPer!);
  let n = 0;
  const maxData = Math.max(...blocks.map((b) => b.data.length));
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) if (i < b.data.length) out[n++] = b.data[i]!;
  }
  for (let i = 0; i < ecPer!; i++) {
    for (const b of blocks) out[n++] = b.ec[i]!;
  }
  return out;
}

export function encodeQRMatrix(text: string, level: QrEcLevel = "M"): boolean[][] {
  const bytes = utf8Bytes(text);
  const version = pickVersion(bytes.length, level);
  const size = 21 + 4 * (version - 1);
  const writer = bitWriter();
  writer.write(0b0100, 4);
  writer.write(bytes.length, lengthBits(version));
  for (const b of bytes) writer.write(b, 8);
  const cap = RS_TABLE[version - 1]![EC_INDEX[level]]![0]! * 8;
  const remain = cap - writer.bits.length;
  writer.write(0, Math.min(4, Math.max(0, remain)));
  while (writer.bits.length % 8) writer.write(0, 1);
  const data = writer.toCodewords(RS_TABLE[version - 1]![EC_INDEX[level]]![0]!);
  const stream = interleave(version, level, data);

  let best: number[][] | null = null;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const grid: (number | null)[][] = Array.from({ length: size }, () =>
      Array<number | null>(size).fill(null),
    );
    placeFinders(grid, size);
    placeTiming(grid, size);
    placeAlign(grid, version);
    reserveFormat(grid, size);
    placeVersion(grid, version);
    placeData(grid, stream, mask);
    paintFormat(grid, formatBits(level, mask));
    const numeric = grid.map((row) => row.map((v) => v ?? 0));
    const score = penalty(numeric);
    if (score < bestScore) {
      bestScore = score;
      best = numeric;
    }
  }
  return best!.map((row) => row.map((v) => v === 1));
}
