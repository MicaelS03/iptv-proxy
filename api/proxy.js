export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "VLC/3.0.18 LibVLC/3.0.18",
        "Accept": "*/*",
        "Accept-Encoding": "identity"
      }
    });

    if (!response.ok) return res.status(502).send("Upstream: " + response.status);

    res.setHeader("Content-Type", response.headers.get("content-type") || "video/mp2t");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).send("Erro: " + err.message);
  }
}
