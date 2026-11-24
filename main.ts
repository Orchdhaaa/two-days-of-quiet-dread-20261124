import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Approved. It works, I understand every line, and I am quietly certain that one day I will not.";

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
const outFile = `${outDir}/entry.txt`;

const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 140) {
  throw new Error(`line is ${codePoints} code points, gate is 1-140`);
}
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength > 140) {
  throw new Error(`line is ${byteLength} bytes, gate is at most 140 bytes`);
}
if (!/approved|lgtm/i.test(LINE)) {
  throw new Error("line must contain an approval word");
}
if (LINE.trim().length === 0) {
  throw new Error("line is whitespace only");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
if (LINE.includes("—")) {
  throw new Error("line must not contain an em dash");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");
const back = readFileSync(outFile, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: written file differs from the line");
}
if (!back.endsWith(".")) {
  throw new Error("line must end with a period");
}
console.log(`wrote ${codePoints} code points to ${outFile}`);
