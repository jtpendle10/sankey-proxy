// index.js
const express    = require('express');
const fetch      = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// YOUR RAW TOKEN (no “token ” prefix here)
const FALLBACK_API_TOKEN = "niou_YkiaMScYAxbh4fwn3Mx2Hpzeh3n9Va5UBVSW";

// Upstream GraphQL endpoint (no query-param)
const TARGET_GRAPHQL = 'https://wlgore.api.ndustrial.io/graphql';

// ─── 1. CORS MIDDLEWARE ────────────────────────────────────────────
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",  "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, User-Agent");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ─── 2. GRAPHQL FORWARDING ────────────────────────────────────────
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
    return res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy request failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Gore‐GraphQL proxy listening on port ${port}`);
});
