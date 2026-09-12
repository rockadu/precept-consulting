import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5173;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  if (clean === "/" || clean === "") return path.join(root, "index.html");

  const publicFile = path.join(root, "public", clean);
  if (fs.existsSync(publicFile) && fs.statSync(publicFile).isFile()) return publicFile;

  const direct = path.join(root, clean);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;

  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const type = mime[path.extname(file)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Precept site em http://127.0.0.1:${port}`);
});
