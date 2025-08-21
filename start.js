#!/usr/bin/env node

// Script de inicio simplificado para ROJO Pay
// Uso: node start.js

const fs = require('fs');
const path = require('path');

console.log(`
🔴 ========================================
   ROJO PAY - REBEL PAYMENT PLATFORM
   ========================================
   
   🚀 Iniciando plataforma de pagos rebelde...
   💀 Con minting automático de NFTs en Base
   🔥 Onchain Summer 2025
   
🔴 ========================================
`);

// Verificar si existe .env
if (!fs.existsSync('.env')) {
    console.log('⚠️  Archivo .env no encontrado!');
    console.log('📝 Copia env.example a .env y configura tus API keys:');
    console.log('   cp env.example .env');
    console.log('   # Luego edita .env con tus claves reales');
    console.log('');
    
    // Mostrar las variables requeridas
    console.log('🔑 Variables requeridas para funcionar:');
    console.log('   - COINBASE_API_KEY (obtener en commerce.coinbase.com)');
    console.log('   - COINBASE_WEBHOOK_SECRET (del dashboard de webhooks)');
    console.log('   - PRIVATE_KEY (wallet que minteará NFTs)');
    console.log('   - NFT_CONTRACT_ADDRESS (después de deployar contrato)');
    console.log('');
    console.log('📖 Ver QUICK_START.md para instrucciones completas');
    console.log('');
}

// Verificar node_modules
if (!fs.existsSync('node_modules')) {
    console.log('📦 Instalando dependencias...');
    require('child_process').execSync('npm install', { stdio: 'inherit' });
}

// Cargar environment
require('dotenv').config();

// Verificar variables críticas
const criticalVars = {
    'COINBASE_API_KEY': 'API Key de Coinbase Commerce',
    'COINBASE_WEBHOOK_SECRET': 'Webhook Secret de Coinbase',
    'PRIVATE_KEY': 'Private Key para mintear NFTs',
    'NFT_CONTRACT_ADDRESS': 'Address del contrato NFT deployado'
};

let missingVars = [];
for (const [envVar, description] of Object.entries(criticalVars)) {
    if (!process.env[envVar]) {
        missingVars.push(`${envVar} (${description})`);
    }
}

if (missingVars.length > 0) {
    console.log('🔴 Variables de entorno faltantes:');
    missingVars.forEach(v => console.log(`   ❌ ${v}`));
    console.log('');
    console.log('⚡ La aplicación funcionará parcialmente sin estas variables');
    console.log('🎯 Para funcionalidad completa, configura todas las variables en .env');
    console.log('');
}

// Mostrar status
console.log('📊 Status de configuración:');
console.log(`   ✅ Frontend: Disponible en http://localhost:${process.env.PORT || 3000}`);
console.log(`   ${process.env.COINBASE_API_KEY ? '✅' : '❌'} Coinbase Commerce API`);
console.log(`   ${process.env.NFT_CONTRACT_ADDRESS ? '✅' : '❌'} NFT Contract (minting ${process.env.NFT_CONTRACT_ADDRESS ? 'habilitado' : 'deshabilitado'})`);
console.log(`   ${process.env.COINBASE_WEBHOOK_SECRET ? '✅' : '❌'} Webhook Security`);
console.log('');

// Mostrar información útil
if (process.env.NFT_CONTRACT_ADDRESS) {
    const isTestnet = (process.env.RPC_URL || '').includes('sepolia');
    const explorerUrl = isTestnet 
        ? `https://sepolia.basescan.org/address/${process.env.NFT_CONTRACT_ADDRESS}`
        : `https://basescan.org/address/${process.env.NFT_CONTRACT_ADDRESS}`;
    
    console.log('🎨 NFT Contract Info:');
    console.log(`   📍 Address: ${process.env.NFT_CONTRACT_ADDRESS}`);
    console.log(`   🌐 Network: ${isTestnet ? 'Base Sepolia (Testnet)' : 'Base Mainnet'}`);
    console.log(`   🔗 Explorer: ${explorerUrl}`);
    console.log('');
}

console.log('🚀 Para comenzar:');
console.log('   1. Ir a http://localhost:3000');
console.log('   2. Crear un pago de prueba');
console.log('   3. Pagar con Coinbase Commerce');
console.log('   4. Recibir NFT automáticamente! 🔴');
console.log('');

console.log('🆘 Ayuda:');
console.log('   📖 README completo: ./README.md');
console.log('   ⚡ Setup rápido: ./QUICK_START.md');
console.log('   🔗 Docs CDP: https://docs.cdp.coinbase.com');
console.log('');

// Iniciar el servidor
console.log('🔴 Iniciando servidor ROJO Pay...\n');

try {
    require('./server.js');
} catch (error) {
    console.error('💀 Error iniciando servidor:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verificar que todas las dependencias estén instaladas');
    console.log('   2. Revisar configuración en .env');
    console.log('   3. Verificar que el puerto no esté en uso');
    process.exit(1);
}
