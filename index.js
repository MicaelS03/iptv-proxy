import http from "http";
import { parse } from "url";

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  const { query } = parse(req.url, true);
  const target = query.url;

  if (!target) {
    res.writeHead(400);
    return res.end("Missing URL");
  }

  const targetUrl = new URL(target);
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: targetUrl.pathname,
    method: "GET",
    headers: {
      "User-Agent": "VLC/3.0.18 LibVLC/3.0.18",
      "Accept": "*/*"
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      "Content-Type": proxyRes.headers["content-type"] || "video/mp2t",
      "Access-Control-Allow-Origin": "*"
    });
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    res.writeHead(500);
    res.end("Proxy error: " + err.message);
  });

  proxyReq.end();
}).listen(PORT, () => {
  console.log(`Proxy a correr na porta ${PORT}`);
});
