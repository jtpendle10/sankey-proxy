// index.js
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Your fallback token (exactly as you had it in your previous JS file)
const FALLBACK_API_TOKEN = "token niou_YkiaMScYAxbh4fwn3Mx2Hpzeh3n9Va5UBVSW";

// The true upstream GraphQL endpoint (with the name=fetch_vis_data query param)
const TARGET_GRAPHQL = 'https://wlgore.api.ndustrial.io/graphql?name=fetch_vis_data';

// Allow CORS from any origin (or lock it down to your domain if desired)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// POST /api/graphql will forward to the real API with Authorization header
app.post('/api/graphql', async (req, res) => {
  try {
    // Forward the exact JSON body to the upstream GraphQL
    const response = await fetch(TARGET_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': FALLBACK_API_TOKEN
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Gore‐GraphQL proxy listening on port ${port}`);
});
