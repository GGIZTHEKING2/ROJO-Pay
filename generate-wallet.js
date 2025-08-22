// Script para generar wallet nueva para ROJO Pay
const { ethers } = require('ethers');

console.log('🔴 Generando wallet nueva para ROJO Pay...\n');

// Generar wallet random
const wallet = ethers.Wallet.createRandom();

console.log('✅ Wallet generada exitosamente!\n');
console.log('📍 ADDRESS (para usar como INITIALOWNER):');
console.log(wallet.address);
console.log('\n🔑 PRIVATE KEY (para Railway - SIN 0x):');
console.log(wallet.privateKey.slice(2)); // Sin el 0x
console.log('\n🌱 MNEMONIC (palabras de recuperación):');
console.log(wallet.mnemonic.phrase);

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('1. Copiar ADDRESS y usarla en nuevos contratos');
console.log('2. Copiar PRIVATE KEY (sin 0x) para Railway');
console.log('3. Enviar ETH de testnet a esta address');
console.log('4. ¡Usar en ROJO Pay!');

console.log('\n💰 OBTENER ETH GRATIS:');
console.log('https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet');
