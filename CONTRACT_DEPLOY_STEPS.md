# 🎨 Deploy del Contrato RojoRebelNFT - Paso a Paso

## 🚀 **Tu app ya está funcionando en:** 
### https://rojo-pay-production.up.railway.app/

Ahora vamos por el contrato NFT para completar la magia!

---

## 📋 **Pasos para Deploy en Remix (5 minutos)**

### **1. Abrir Remix**
- Ir a [remix.ethereum.org](https://remix.ethereum.org)
- Es gratis y no necesitas instalar nada

### **2. Crear el archivo del contrato**
- En "File Explorer" (izquierda) > "Create New File"
- Nombre: `RojoRebelNFT.sol`

### **3. Copiar el código completo**
```solidity
// Copiar todo el contenido de: ROJO_Ecosystem/contracts/RojoRebelNFT.sol
// El archivo completo está en tu proyecto local
```

### **4. Compilar el contrato**
- Tab "Solidity Compiler" (segundo icono izquierda)
- Compiler version: **0.8.20** o superior
- Click "Compile RojoRebelNFT.sol"
- Debe aparecer ✅ sin errores

### **5. Deploy en Base Sepolia**
- Tab "Deploy & Run Transactions" (tercer icono)
- Environment: **"Injected Provider - MetaMask"**
- Conectar MetaMask y cambiar a **Base Sepolia**
- Network details para añadir Base Sepolia:
  ```
  Network Name: Base Sepolia
  RPC URL: https://sepolia.base.org
  Chain ID: 84532
  Currency: ETH
  Explorer: https://sepolia.basescan.org
  ```

### **6. Configurar constructor**
- Contract: **RojoRebelNFT**
- INITIALOWNER: Tu wallet address (ejemplo: 0x742d35...)
- BASEURI: `https://rojo-pay-production.up.railway.app/metadata/`
- Click **"Deploy"**

### **7. Confirmar en MetaMask**
- Aprobar la transacción
- Esperar confirmación (~30 segundos)

---

## ✅ **Después del Deploy**

### **8. Copiar Contract Address**
- En Remix, después del deploy aparecerá el contrato
- Copiar la dirección (ejemplo: 0x1234...)

### **9. Configurar en Railway**
- Ir a tu proyecto en Railway dashboard
- Variables > Add Variable:
  ```
  NFT_CONTRACT_ADDRESS=0x_tu_contract_address_aqui
  RPC_URL=https://sepolia.base.org
  PRIVATE_KEY=tu_private_key_sin_0x
  ```

### **10. Verificar el contrato (opcional)**
- Ir a [sepolia.basescan.org](https://sepolia.basescan.org)
- Buscar tu contract address
- "Contract" > "Verify and Publish"
- Subir el código fuente

---

## 🧪 **Testing Final**

1. **Ir a tu app**: https://rojo-pay-production.up.railway.app/
2. **Crear un pago de prueba**
3. **Pagar con Coinbase Commerce testnet**
4. **Recibir NFT automáticamente** 🔥

---

## 🆘 **¿Necesitas ETH para gas fees?**
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- Es gratis para testing

---

## 🏆 **¡Una vez deployado tendrás:**
- ✅ Plataforma de pagos funcionando
- ✅ NFT minting automático  
- ✅ Proyecto completo para Onchain Summer
- ✅ Listo para aplicar a Awards!

**¡Vamos a completar esta madre rebelde! 🔴💀🚀**
