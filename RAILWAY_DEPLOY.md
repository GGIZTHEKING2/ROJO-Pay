# 🚀 ROJO Pay - Deploy a Railway.app

## ⚡ Deploy en 3 pasos súper fáciles

### 📋 **Paso 1: Crear cuenta en Railway**

1. **Ir a [railway.app](https://railway.app)**
2. **Click "Login"** y conectar con GitHub
3. **Autorizar Railway** para acceder a tus repos

### 📋 **Paso 2: Subir código a GitHub**

Si no tienes el código en GitHub, crear repo:

1. **Ir a [github.com](https://github.com)** > "New repository"
2. **Nombre**: `ROJO-Pay` (o el que prefieras)
3. **Público/Privado**: Como prefieras
4. **NO añadir README** (ya tenemos uno)

Luego conectar tu código local:

```bash
# En tu terminal, desde la carpeta del proyecto:
git remote add origin https://github.com/TU-USUARIO/ROJO-Pay.git
git branch -M main
git push -u origin main
```

### 📋 **Paso 3: Deploy en Railway**

1. **En Railway dashboard**: Click "Deploy from GitHub repo"
2. **Seleccionar** el repo "ROJO-Pay"
3. **Railway detectará automáticamente** que es Node.js
4. **Deploy automático** comenzará! 🚀

### 🔧 **Paso 4: Configurar Variables de Entorno**

En Railway dashboard > Tu proyecto > "Variables":

```bash
# === OBLIGATORIAS ===
COINBASE_API_KEY=tu_coinbase_commerce_api_key
COINBASE_WEBHOOK_SECRET=tu_webhook_shared_secret
PORT=3000

# === BLOCKCHAIN (para NFT minting) ===
PRIVATE_KEY=tu_private_key_sin_0x
NFT_CONTRACT_ADDRESS=0x_tu_contract_address_deployado
RPC_URL=https://sepolia.base.org

# === OPCIONALES ===
GM_API_KEY=tu_gemini_api_key
FRONTEND_ORIGIN=https://tu-app.railway.app
NODE_ENV=production
```

### 🎯 **¡Ya está! Tu app estará en:**
`https://tu-proyecto-nombre.railway.app`

---

## 🔑 **Cómo obtener las API Keys**

### 💰 **Coinbase Commerce API**
1. Ir a [commerce.coinbase.com](https://commerce.coinbase.com)
2. Crear cuenta > Dashboard
3. Settings > API Keys > "Create an API Key"
4. Copiar la clave generada

### 🔗 **Webhook Secret**
1. En Coinbase Commerce Dashboard
2. Settings > Webhooks
3. "Add an endpoint": `https://tu-app.railway.app/coinbase-webhook`
4. Events: Seleccionar "charge:confirmed"
5. Save > Copiar el "Shared secret"

### 🎨 **NFT Contract Address**
1. Deploy el contrato `RojoRebelNFT.sol` en Base Sepolia
2. Usar [Remix](https://remix.ethereum.org) o Foundry
3. Copiar la dirección del contrato deployado

### 💳 **Private Key**
1. En MetaMask: Cuenta > Detalles > "Export Private Key"
2. **⚠️ IMPORTANTE**: Sin el prefijo "0x"
3. **🔒 SEGURIDAD**: Nunca compartir esta clave

---

## 🧪 **Testing después del deploy**

### ✅ **Verificar que funciona**:
1. Ir a tu URL de Railway
2. Debería cargar el frontend rebelde de ROJO Pay
3. Crear un pago de prueba
4. Ver los logs en Railway dashboard

### 🔍 **Debugging**:
- **Logs**: Railway dashboard > tu proyecto > "Deployments" > click en último deploy
- **Variables**: Verificar que todas estén configuradas
- **Domains**: Railway asigna dominio automáticamente

---

## 🎉 **¡Listo para Onchain Summer!**

Una vez deployado:
- ✅ **Frontend funcionando** en tu dominio Railway
- ✅ **Backend procesando pagos** con Commerce API
- ✅ **NFT minting** automático (si configuraste contrato)
- ✅ **Aplicar a Onchain Summer Awards**! 🏆

---

## 🆘 **Problemas comunes**

### ❌ **"Build failed"**
- Verificar que `package.json` tenga script "start"
- Verificar que todas las dependencias estén en `dependencies` (no `devDependencies`)

### ❌ **"App crashed"**
- Revisar logs en Railway
- Verificar variables de entorno
- Asegurar que `PORT` esté configurado

### ❌ **"NFT minting failed"**
- Verificar `PRIVATE_KEY` (sin 0x)
- Verificar `NFT_CONTRACT_ADDRESS`
- Asegurar que tienes ETH en la wallet

---

**¡Tu plataforma rebelde está lista para conquistar el mundo cripto! 🔴💀🚀**
