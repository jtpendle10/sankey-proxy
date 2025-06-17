// index.js
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const fetch      = require('node-fetch');

const app = express();

// 1) CORS middleware, applied *before* any body parsing
app.use(cors({
  origin: 'https://jtpendle10.github.io',      // or '*' to allow all origins
  methods: ['POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','User-Agent']
}));

// 2) Explicitly handle preflight for every route
app.options('*', cors());

// 3) Now parse JSON bodies
app.use(bodyParser.json());

// 4) Your token & target URL
const FALLBACK_API_TOKEN = "niou_YkiaMScYAxbh4fwn3Mx2Hpzeh3n9Va5UBVSW";
const TARGET_GRAPHQL     = 'https://wlgore.api.ndustrial.io/graphql';

// 5) Forward POST /api/graphql
app.post('/api/graphql', async (req, res) => {
  try {
    const upstream = await fetch(TARGET_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `token ${FALLBACK_API_TOKEN}`,
        'User-Agent':    'insomnia/11.0.2'
      },
      body: JSON.stringify(req.body)
    });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// 6) Start
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Proxy listening on port ${port}`));
