# 🔴 ROJO Pay - Plataforma de Pagos Rebelde

![ROJO Pay](../assets/ROJO.png)

## 🚀 Descripción

**ROJO Pay** es una plataforma de pagos crypto con actitud rebelde que permite generar enlaces de pago y automáticamente mintea NFTs únicos como recibos en Base blockchain. Cada pago exitoso genera un "Red Rebel Receipt" NFT coleccionable.

### ✨ Características

- 💳 **Pagos Simplificados**: Genera enlaces de pago crypto en segundos
- 🎨 **NFT Automático**: Cada pago minta un NFT único como recibo
- ⚡ **Base Blockchain**: Construido en Base para fees bajos y velocidad
- 🔥 **Tema Rebelde**: UI oscura con elementos rojos vibrantes
- 📱 **Responsive**: Funciona perfecto en mobile y desktop
- 🛡️ **Seguro**: Verificación de webhooks y rate limiting

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Blockchain**: Base (Ethereum L2)
- **Smart Contracts**: Solidity + OpenZeppelin
- **Database**: SQLite (better-sqlite3)
- **Payments**: Coinbase Commerce API
- **Frontend**: HTML5 + TailwindCSS + Vanilla JS
- **NFT Standard**: ERC-721

## 🎯 Herramientas CDP Utilizadas

✅ **Commerce API**: Para crear charges y manejar pagos  
✅ **Base**: Blockchain para smart contracts NFT  
✅ **Wallet Integration**: Para conectar wallets fácilmente  
🔄 **AI Tooling**: Para generación de código (en desarrollo)

## 📦 Instalación

### 1. Clonar y Setup
```bash
cd ROJO_Ecosystem/01_ROJO_Pay
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp env.example .env
# Editar .env con tus keys reales
```

### 3. Deployar Contrato NFT
```bash
# Usar Remix, Foundry o Hardhat para deployar RojoRebelNFT.sol
# Copiar la address del contrato a NFT_CONTRACT_ADDRESS en .env
```

### 4. Configurar Webhook en Coinbase Commerce
1. Ir a [Commerce Dashboard](https://commerce.coinbase.com/dashboard)
2. Settings > Webhooks
3. Añadir endpoint: `https://tu-dominio.com/coinbase-webhook`
4. Copiar el shared secret a `COINBASE_WEBHOOK_SECRET`

### 5. Ejecutar
```bash
npm start
# O para desarrollo:
npm run dev
```

## 🔧 Configuración Detallada

### Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `COINBASE_API_KEY` | API Key de Coinbase Commerce | `12345678-1234-1234...` |
| `COINBASE_WEBHOOK_SECRET` | Shared secret para webhooks | `abcdef123456...` |
| `PRIVATE_KEY` | Private key para mintear NFTs | `a1b2c3d4e5f6...` |
| `NFT_CONTRACT_ADDRESS` | Address del contrato deployado | `0x1234567890...` |
| `RPC_URL` | URL RPC de Base | `https://sepolia.base.org` |

### Deploy del Contrato NFT

El contrato `RojoRebelNFT.sol` está en `/contracts/`. Para deployarlo:

1. **Usando Remix**:
   - Abrir [remix.ethereum.org](https://remix.ethereum.org)
   - Importar el archivo del contrato
   - Compilar con Solidity 0.8.20+
   - Deploy en Base Sepolia (testnet) primero

2. **Constructor Parameters**:
   - `initialOwner`: Tu wallet address
   - `baseURI`: `https://tu-metadata-server.com/nft/`

3. **Verificar Contrato**:
   - En [Base Sepolia Explorer](https://sepolia.basescan.org)
   - Subir el código fuente para verificación

## 🎨 Customización

### Temas y Estilos
El frontend usa CSS custom properties para fácil customización:

```css
:root {
    --rojo-red: #DC2626;      /* Rojo principal */
    --rojo-dark: #991B1B;     /* Rojo oscuro */
    --rojo-black: #000000;    /* Negro profundo */
    --rojo-gray: #111827;     /* Gris oscuro */
}
```

### Metadata de NFTs
Por defecto, los NFTs apuntan a `https://rojo-metadata.vercel.app/receipt/{chargeId}`. Puedes:

1. Deployar tu propio servidor de metadata
2. Usar IPFS para metadata descentralizada
3. Generar metadata dinámica basada en el pago

## 🚀 Deploy a Producción

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar env vars en dashboard
```

### Heroku
```bash
# Crear app
heroku create rojo-pay-app

# Configurar env vars
heroku config:set COINBASE_API_KEY=tu_key

# Deploy
git push heroku main
```

### Railway
```bash
# Conectar repo en railway.app
# Configurar env vars en dashboard
```

## 🧪 Testing

### Test Local
```bash
# Ejecutar servidor
npm start

# Ir a http://localhost:3000
# Crear un charge de prueba
# Usar Coinbase Commerce testnet para pagar
```

### Test Webhook
```bash
# Usar ngrok para exponer localhost
npx ngrok http 3000

# Usar la URL de ngrok en webhook de Coinbase
```

## 🏆 Roadmap

- [x] ✅ Setup básico con Commerce API
- [x] ✅ Frontend rebelde con tema ROJO
- [x] ✅ Integración NFT con Base
- [x] ✅ Webhook para mint automático
- [ ] 🔄 Metadata dinámica con AI
- [ ] 🔄 Galería de NFTs recibidos
- [ ] 🔄 Integration con Wallet Connect
- [ ] 🔄 Support para múltiples tokens

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch: `git checkout -b feature/AmazingFeature`
3. Commit cambios: `git commit -m 'Add AmazingFeature'`
4. Push al branch: `git push origin feature/AmazingFeature`
5. Abrir Pull Request

## 📄 Licencia

MIT License - ve [LICENSE](LICENSE) para detalles.

## 🆘 Support

- 📧 Email: rojo@rebellion.crypto
- 🐦 Twitter: [@ROJOPay](https://twitter.com/rojopay)
- 💬 Discord: [ROJO Community](https://discord.gg/rojo)

---

**¡Construido con amor rebelde durante Onchain Summer 2025! 🔥**

*"Pagos simples, NFTs badass" - ROJO Pay Manifesto*