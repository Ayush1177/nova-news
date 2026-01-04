const fs = require("fs");

const s = fs.readFileSync(".env.local", "utf8");
const line = s.split(/\r?\n/).find(l => l.trim().startsWith("DATABASE_URL="));

if (!line) {
  console.log({ found: false, len: 0, startsWithPostgres: false });
  process.exit(0);
}

const raw = line.split("=").slice(1).join("=").trim();
const v = raw.replace(/^"/, "").replace(/"$/, "");

console.log({
  found: true,
  len: v.length,
  startsWithPostgres: v.startsWith("postgres"),
});
