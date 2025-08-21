// server.js - ROJO Pay: Plataforma de pagos rebelde con NFT minting
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const { ethers } = require('ethers'); // Para interactuar con Base
const sqlite3 = require('sqlite3').verbose(); 
const logger = require('./logger');
const pinoHttp = require('pino-http');

const app = express();

// --- Environment Variable Validation ---
const REQUIRED_ENV = ['COINBASE_API_KEY', 'COINBASE_WEBHOOK_SECRET', 'GM_API_KEY', 'FRONTEND_ORIGIN'];
const BLOCKCHAIN_ENV = ['PRIVATE_KEY', 'RPC_URL', 'NFT_CONTRACT_ADDRESS']; // Nuevas variables para blockchain

for (const variable of REQUIRED_ENV) {
  if (!process.env[variable]) {
    logger.warn(`Environment variable ${variable} is not set.`);
  }
}

for (const variable of BLOCKCHAIN_ENV) {
  if (!process.env[variable]) {
    logger.warn(`Blockchain variable ${variable} is not set. NFT minting will be disabled.`);
  }
}

// --- Blockchain Configuration (Base Sepolia for testing) ---
let provider, wallet, nftContract;
const RPC_URL = process.env.RPC_URL || 'https://sepolia.base.org';
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (PRIVATE_KEY && NFT_CONTRACT_ADDRESS) {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // ABI simplificado para el contrato NFT
    const NFT_ABI = [
      'function mint(address to) public returns (uint256)',
      'function mintPaymentReceipt(address to, string memory chargeId, uint256 amount, string memory currency, string memory tokenURI) public returns (uint256)',
      'function totalSupply() public view returns (uint256)',
      'function tokenURI(uint256 tokenId) public view returns (string memory)',
      'function getPaymentData(uint256 tokenId) public view returns (tuple(string chargeId, uint256 amount, string currency, uint256 timestamp, address payer))'
    ];
    
    nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, wallet);
    logger.info(`NFT contract configurado en ${NFT_CONTRACT_ADDRESS}`);
  } catch (error) {
    logger.error(error, 'Error configurando blockchain connection');
  }
} else {
  logger.warn('NFT minting deshabilitado - falta configuración blockchain');
}

app.use(cors({
  // Disallow '*' in production. Fail-safe by not setting a default.
  // The request will be blocked by CORS if the origin is not on the allow-list.
  origin: process.env.FRONTEND_ORIGIN
}));

// --- Core Middleware ---
app.use(pinoHttp({ logger })); // Add structured request logging
app.use(express.json({ limit: '20kb' }));


// Rate limiting simple
// For production, consider a more robust library like 'express-rate-limit'
const rateLimitWindowMs = 60 * 1000;
// Use environment variable for max requests, with a sensible default.
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX, 10) || 60;
const ipCounters = new Map();
setInterval(() => ipCounters.clear(), rateLimitWindowMs);

function ipRateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const c = ipCounters.get(ip) || 0;
  if (c > rateLimitMax) return res.status(429).json({ error: 'Too many requests' });
  ipCounters.set(ip, c + 1);
  next();
}
app.use(ipRateLimit);

// DB (SQLite simple)
const DB_FILE = process.env.DB_FILE || 'rojo_pay.db';
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    logger.error(err, 'Error abriendo base de datos');
  } else {
    logger.info('Base de datos SQLite conectada exitosamente');
  }
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS charges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  charge_id TEXT,
  hosted_url TEXT,
  name TEXT,
  description TEXT,
  amount TEXT,
  currency TEXT,
  metadata TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// ENV
const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET; // shared secret from Coinbase Commerce
const GM_API_KEY = process.env.GM_API_KEY; // generative AI

// UTIL: insert charge record
function saveChargeRow(obj) {
  const stmt = `INSERT INTO charges (charge_id, hosted_url, name, description, amount, currency, metadata, status) VALUES (?,?,?,?,?,?,?,?)`;
  db.run(stmt, [obj.charge_id, obj.hosted_url, obj.name, obj.description, obj.amount, obj.currency, JSON.stringify(obj.metadata||{}), obj.status||'pending'], function(err) {
    if (err) {
      logger.error(err, 'Error guardando charge en DB');
    } else {
      logger.info(`Charge guardado con ID: ${this.lastID}`);
    }
  });
}

// UTIL: Mint NFT como recibo de pago
async function mintRebelNFT(payerAddress, chargeData) {
  if (!nftContract) {
    logger.warn('NFT contract no disponible para minting');
    return null;
  }
  
  try {
    // Generar metadata básica para el NFT
    const tokenURI = `https://rojo-metadata.vercel.app/receipt/${chargeData.id}`;
    
    logger.info(`Intentando mint NFT para ${payerAddress} con charge ${chargeData.id}`);
    
    // Mint del NFT usando el método del contrato
    const tx = await nftContract.mintPaymentReceipt(
      payerAddress,
      chargeData.id,
      ethers.parseUnits(chargeData.pricing.local.amount, 0), // Convertir a wei
      chargeData.pricing.local.currency,
      tokenURI
    );
    
    logger.info(`Transacción enviada: ${tx.hash}`);
    
    // Esperar confirmación
    const receipt = await tx.wait();
    logger.info(`NFT minteado exitosamente! TX: ${tx.hash}, Block: ${receipt.blockNumber}`);
    
    return {
      tokenId: receipt.logs[0]?.topics[3], // El tokenId está en los logs
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
    
  } catch (error) {
    logger.error(error, 'Error al mintear NFT');
    return null;
  }
}

// Endpoint: create-charge
app.post('/create-charge', async (req, res, next) => {
  try {
    const { name, description, amount, currency } = req.body;
    if(!name || !amount) return res.status(400).json({ error: 'Missing name or amount' });

    // sanitize basic
    if(Number(amount) <= 0) return res.status(400).json({ error: 'Amount must be > 0' });

    const body = {
      name: String(name).slice(0,120),
      description: String(description || '').slice(0,400),
      local_price: { amount: String(amount), currency: String(currency || 'USD') },
      pricing_type: 'fixed_price',
      metadata: { product: 'AuraKit', name }
    };

    const r = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if(!r.ok) {
      const txt = await r.text();
      logger.error({ detail: txt }, 'Coinbase create charge API error');
      return res.status(502).json({ error: 'Coinbase API error' }); // 502 Bad Gateway is more appropriate
    }

    const data = await r.json();
    const hosted_url = data.data.hosted_url;
    const charge_id = data.data.id;

    // save minimal to DB
    saveChargeRow({ charge_id, hosted_url, name: body.name, description: body.description, amount: body.local_price.amount, currency: body.local_price.currency, metadata: body.metadata, status: 'pending' });

    return res.json({ hosted_url, charge: data.data });
  } catch (err) {
    next(err); // Pass error to the centralized handler
  }
});

// Webhook: Coinbase Commerce signature verification
// Coinbase sends raw JSON; verification uses HMAC SHA256 with webhook shared secret and raw body
app.post('/coinbase-webhook', bodyParser.raw({ type: 'application/json' }), (req, res, next) => {
  try {
    const signature = req.get('X-CC-Webhook-Signature') || '';
    const payload = req.body; // This is a Buffer

    if (!COINBASE_WEBHOOK_SECRET) {
      logger.error('Webhook secret is not configured. Cannot verify payload.');
      return res.status(500).send('Webhook secret not configured');
    }

    const hmac = crypto.createHmac('sha256', COINBASE_WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8');
    const receivedSignature = Buffer.from(signature, 'utf8');

    if (!crypto.timingSafeEqual(digest, receivedSignature)) {
      return res.status(400).send('invalid signature');
    }

    const parsed = JSON.parse(payload.toString());
    const eventType = parsed.event?.type;
    const chargeId = parsed.event?.data?.id;
    req.log.info({ eventType, chargeId }, 'Coinbase webhook received');

    // update DB status if charge confirmed/resolved
    if(eventType === 'charge:confirmed' || eventType === 'charge:resolved') {
      const stmt = 'UPDATE charges SET status = ? WHERE charge_id = ?';
      db.run(stmt, ['confirmed', chargeId], function(err) {
        if (err) {
          logger.error(err, 'Error actualizando status en DB');
        } else {
          logger.info(`Status actualizado para charge ${chargeId}`);
        }
      });
      
      // 🔥 ROJO PAY: Mint NFT como recibo de pago! 🔥
      if(eventType === 'charge:confirmed' && parsed.event?.data) {
        const chargeData = parsed.event.data;
        
        // Obtener dirección del pagador desde los payments
        const payerAddress = chargeData.payments?.[0]?.transaction_id || 
                           chargeData.payments?.[0]?.network || 
                           '0x742d35Cc6634C0532925a3b8D1E015C6c00bC66A'; // Fallback address
        
        // Intentar mint del NFT de forma asíncrona
        mintRebelNFT(payerAddress, chargeData)
          .then(result => {
            if (result) {
              logger.info({ 
                chargeId, 
                tokenId: result.tokenId, 
                txHash: result.txHash 
              }, 'NFT Red Rebel minteado como recibo de pago! 🔴');
            }
          })
          .catch(error => {
            logger.error(error, 'Error en mint asíncrono de NFT');
          });
      }
    }

    res.status(200).send('ok');
  } catch (err) {
    next(err); // Pass error to the centralized handler
  }
});

// AI suggest endpoint (server-side)
app.post('/ai-suggest', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if(!prompt) return res.status(400).json({ error: 'Missing prompt' });

    // Example for Google Gemini (Generative Language), update if you use OpenAI
    const model = process.env.AI_MODEL_NAME || 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GM_API_KEY}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

    // Using native fetch available in Node.js 18+
    const r = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if(!r.ok) {
      const txt = await r.text();
      logger.error({ detail: txt }, 'Generative AI API error');
      return res.status(502).json({ error: 'AI API error' });
    }

    const result = await r.json();
    const suggestion = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ suggestion: suggestion.trim(), raw: result });
  } catch (err) {
    next(err); // Pass error to the centralized handler
  }
});

// Serve static for simple testing (optional)
app.use(express.static(path.join(__dirname, 'public')));

// --- Error Handling Middleware ---
// Optional: fallthrough for 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Custom error handler.
app.use((err, req, res, next) => {
  logger.error(err, 'An unhandled error occurred');
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));