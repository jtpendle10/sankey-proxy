const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Replace this with your actual, final Render‐provided domain or localhost for testing
const TARGET_GRAPHQL = 'https://wlgore.api.ndustrial.io/graphql?name=fetch_vis_data';

app.use((req, res, next) => {
  // Allow any origin (or lock down to your domain)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/graphql', async (req, res) => {
  try {
    const originalBody = req.body;
    // Forward the incoming body exactly to the target GraphQL endpoint
    const response = await fetch(TARGET_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalBody)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// Render will set PORT via environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Proxy listening on port ${port}`);
});
