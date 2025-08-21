// Script para deployar el contrato RojoRebelNFT usando ethers.js
// Uso: node scripts/deploy-contract.js

require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function deployContract() {
    console.log('🔴 Iniciando deploy del contrato RojoRebelNFT...');
    
    // Verificar env vars
    if (!process.env.PRIVATE_KEY || !process.env.RPC_URL) {
        console.error('❌ PRIVATE_KEY y RPC_URL son requeridos en .env');
        process.exit(1);
    }
    
    // Setup provider y wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log(`📍 Deploying desde: ${wallet.address}`);
    
    // Verificar balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance < ethers.parseEther('0.001')) {
        console.error('❌ Balance insuficiente para deploy (mínimo 0.001 ETH)');
        process.exit(1);
    }
    
    try {
        // Leer el contrato compilado (necesitas compilarlo primero)
        console.log('📖 Leyendo bytecode del contrato...');
        
        // Bytecode del contrato (obtener de Remix o compilar con solc)
        // Por ahora, usamos un ejemplo simple
        const contractBytecode = "0x608060405234801561001057600080fd5b50..."; // Tu bytecode aquí
        
        if (contractBytecode === "0x608060405234801561001057600080fd5b50...") {
            console.log('⚠️  Necesitas compilar el contrato primero y obtener el bytecode');
            console.log('📝 Pasos:');
            console.log('   1. Ir a https://remix.ethereum.org');
            console.log('   2. Subir RojoRebelNFT.sol');
            console.log('   3. Compilar el contrato');
            console.log('   4. Copiar bytecode a este script');
            process.exit(1);
        }
        
        // ABI del contrato
        const contractABI = [
            "constructor(address initialOwner, string memory baseURI)",
            "function mint(address to) public returns (uint256)",
            "function mintPaymentReceipt(address to, string memory chargeId, uint256 amount, string memory currency, string memory tokenURI) public returns (uint256)",
            "function totalSupply() public view returns (uint256)"
        ];
        
        // Crear factory del contrato
        const ContractFactory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
        
        // Deploy parameters
        const initialOwner = wallet.address;
        const baseURI = process.env.NFT_METADATA_BASE_URL || "https://rojo-metadata.vercel.app/nft/";
        
        console.log('🚀 Deploying contrato...');
        console.log(`   Owner: ${initialOwner}`);
        console.log(`   Base URI: ${baseURI}`);
        
        // Deploy el contrato
        const contract = await ContractFactory.deploy(initialOwner, baseURI);
        
        console.log('⏳ Esperando confirmación...');
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        
        console.log('🎉 ¡Contrato deployado exitosamente!');
        console.log(`📍 Address: ${contractAddress}`);
        console.log(`🔗 Explorer: https://sepolia.basescan.org/address/${contractAddress}`);
        
        // Guardar la address en archivo
        const deployInfo = {
            address: contractAddress,
            deployer: wallet.address,
            network: process.env.RPC_URL.includes('sepolia') ? 'Base Sepolia' : 'Base Mainnet',
            timestamp: new Date().toISOString(),
            baseURI,
            txHash: contract.deploymentTransaction()?.hash
        };
        
        fs.writeFileSync(
            path.join(__dirname, '../deployed-contract.json'),
            JSON.stringify(deployInfo, null, 2)
        );
        
        console.log('💾 Información guardada en deployed-contract.json');
        console.log('📝 Actualiza NFT_CONTRACT_ADDRESS en tu .env:');
        console.log(`NFT_CONTRACT_ADDRESS=${contractAddress}`);
        
        // Test mint (opcional)
        if (process.argv.includes('--test-mint')) {
            console.log('🧪 Testing mint...');
            const mintTx = await contract.mint(wallet.address);
            const receipt = await mintTx.wait();
            console.log(`✅ Test mint exitoso! TX: ${mintTx.hash}`);
        }
        
    } catch (error) {
        console.error('💀 Error durante deploy:', error);
        process.exit(1);
    }
}

// Función para verificar contrato en Basescan
async function verifyContract(address) {
    console.log('🔍 Para verificar el contrato en Basescan:');
    console.log('1. Ir a https://sepolia.basescan.org/address/' + address);
    console.log('2. Click en "Contract" > "Verify and Publish"');
    console.log('3. Subir el código fuente de RojoRebelNFT.sol');
    console.log('4. Usar Solidity 0.8.20+ y optimización habilitada');
}

// Ejecutar
if (require.main === module) {
    deployContract().catch(console.error);
}

module.exports = { deployContract, verifyContract };
