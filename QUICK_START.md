# 🚀 ROJO Pay - Quick Start Guide

## ⚡ Setup en 5 minutos

### 1. 📦 Instalar dependencias
```bash
cd ROJO_Ecosystem/01_ROJO_Pay
npm install
```

### 2. 🔑 Configurar APIs

#### Coinbase Commerce (Requerido)
1. Ir a [commerce.coinbase.com](https://commerce.coinbase.com)
2. Crear cuenta y obtener API Key
3. Copiar API Key y Webhook Secret

#### Base Wallet (Para NFTs)
1. Crear wallet en [MetaMask](https://metamask.io)
2. Añadir Base Sepolia network
3. Conseguir ETH de testnet en [faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

### 3. ⚙️ Configurar variables
```bash
cp env.example .env
```

Editar `.env`:
```bash
COINBASE_API_KEY=tu_api_key_aqui
COINBASE_WEBHOOK_SECRET=tu_webhook_secret_aqui
PRIVATE_KEY=tu_private_key_sin_0x
FRONTEND_ORIGIN=http://localhost:3000
```

### 4. 🎨 Deploy contrato NFT

#### Opción A: Remix (Fácil)
1. Ir a [remix.ethereum.org](https://remix.ethereum.org)
2. Crear archivo `RojoRebelNFT.sol`
3. Copiar código desde `/contracts/RojoRebelNFT.sol`
4. Compilar con Solidity 0.8.20+
5. Deploy en Base Sepolia con MetaMask
6. Copiar contract address al `.env`

#### Opción B: Script automático
```bash
# Editar scripts/deploy-contract.js con bytecode
node scripts/deploy-contract.js
```

### 5. 🔗 Configurar webhook
1. En [Commerce Dashboard](https://commerce.coinbase.com/dashboard)
2. Settings > Webhooks
3. Endpoint URL: `https://tu-dominio.com/coinbase-webhook`
4. Guardar y copiar shared secret

### 6. 🚀 Lanzar
```bash
npm start
```

Ir a `http://localhost:3000` y crear tu primer pago rebelde! 🔴

---

## 🏗️ Deploy a producción

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel --prod
```

### Railway
1. Conectar repo en [railway.app](https://railway.app)
2. Configurar env vars
3. Deploy automático

### Heroku
```bash
heroku create tu-app-name
git push heroku main
```

---

## 🧪 Testing

### Test local completo:
1. ✅ Crear charge con el form
2. ✅ Pagar con Coinbase Commerce testnet
3. ✅ Verificar NFT minteado en [Base Sepolia Explorer](https://sepolia.basescan.org)

### URLs importantes:
- **Base Sepolia RPC**: `https://sepolia.base.org`
- **Faucet ETH**: [Coinbase Faucets](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- **Explorer**: [sepolia.basescan.org](https://sepolia.basescan.org)

---

## 🆘 Troubleshooting

### Error: "NFT contract no disponible"
- ✅ Verificar `NFT_CONTRACT_ADDRESS` en .env
- ✅ Confirmar que el contrato está deployado
- ✅ Verificar `PRIVATE_KEY` (sin 0x)

### Error: "Webhook signature invalid"
- ✅ Verificar `COINBASE_WEBHOOK_SECRET`
- ✅ Confirmar endpoint en Coinbase dashboard

### Error: "Insufficient funds"
- ✅ Añadir ETH a tu wallet desde el faucet
- ✅ Verificar network (Base Sepolia vs Mainnet)

---

**¡Listo para recibir pagos y mintear NFTs rebeldes! 🔥**

*¿Problemas? Abre un issue en GitHub* 💀
