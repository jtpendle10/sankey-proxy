const express    = require('express');
const fetch      = require('node-fetch');
const bodyParser = require('body-parser');
const cors       = require('cors');

const app = express();

// 1) Enable CORS for your GitHub Pages origin (or use '*' for any)
app.use(cors({
  origin: 'https://jtpendle10.github.io',
  methods: ['POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','User-Agent']
}));

app.use(bodyParser.json());

const FALLBACK_API_TOKEN = "niou_Fls0b1bGpTnC6kquMP16SVFn0dE3NORIXNet";
const TARGET_GRAPHQL     = 'https://wlgore.api.ndustrial.io/graphql';

app.post("/api/graphql", async (req, res) => {
  try {
    const response = await fetch(TARGET_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `token ${FALLBACK_API_TOKEN}`,
        "User-Agent":    "insomnia/11.0.2"
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy listening on ${port}`));
