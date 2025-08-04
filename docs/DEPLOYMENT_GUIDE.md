# Deployment Guide

This guide provides step-by-step instructions for deploying the RentPaymentSystem smart contract to various Ethereum networks.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Network Configuration](#network-configuration)
- [Deployment Process](#deployment-process)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Software Requirements

- **Node.js**: Version 14 or higher
- **npm**: Comes with Node.js
- **Git**: For version control

### Accounts and Services

- **Ethereum Wallet**: With private key for deployment
- **Infura Account**: For network access (or alternative RPC provider)
- **Etherscan Account**: For contract verification (optional)

### Funding Requirements

Ensure your deployment wallet has sufficient ETH for:
- **Mainnet**: ~0.01-0.05 ETH (depending on gas prices)
- **Goerli/Sepolia**: Test ETH from faucets
- **Local Network**: No real ETH required

## Environment Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd smart-contract-mlh
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following variables:

```env
# Network Configuration
API_URL_MAINNET=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
API_URL_GOERLI=https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
API_URL_SEPOLIA=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Deployment Account
PRIVATE_KEY=your_private_key_without_0x_prefix

# Optional: Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Gas Configuration
GAS_PRICE=20000000000
GAS_LIMIT=5000000
```

### 3. Security Setup

```bash
# Add .env to .gitignore
echo ".env" >> .gitignore

# Set appropriate file permissions
chmod 600 .env
```

**⚠️ SECURITY WARNING**: Never commit your private key to version control!

## Network Configuration

### Update Hardhat Configuration

The current `hardhat.config.js` only supports mainnet. Here's an enhanced version for multiple networks:

```javascript
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { 
    API_URL_MAINNET, 
    API_URL_GOERLI, 
    API_URL_SEPOLIA,
    PRIVATE_KEY,
    ETHERSCAN_API_KEY 
} = process.env;

module.exports = {
    solidity: {
        version: "0.7.3",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    
    defaultNetwork: "hardhat",
    
    networks: {
        // Local development network
        hardhat: {
            chainId: 31337
        },
        
        // Ethereum Mainnet
        mainnet: {
            url: API_URL_MAINNET,
            accounts: [`0x${PRIVATE_KEY}`],
            chainId: 1,
            gasPrice: 20000000000, // 20 gwei
            gas: 5000000
        },
        
        // Goerli Testnet
        goerli: {
            url: API_URL_GOERLI,
            accounts: [`0x${PRIVATE_KEY}`],
            chainId: 5,
            gasPrice: 10000000000, // 10 gwei
            gas: 5000000
        },
        
        // Sepolia Testnet
        sepolia: {
            url: API_URL_SEPOLIA,
            accounts: [`0x${PRIVATE_KEY}`],
            chainId: 11155111,
            gasPrice: 10000000000, // 10 gwei
            gas: 5000000
        }
    },
    
    // Contract verification
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    }
};
```

### Network-Specific Considerations

#### Mainnet
- **High gas costs**: Monitor gas prices using tools like ETH Gas Station
- **Irreversible**: Double-check all configurations
- **Security critical**: Use hardware wallet if possible

#### Testnets (Goerli/Sepolia)
- **Free ETH**: Get test ETH from faucets
- **Lower gas costs**: Ideal for testing
- **Similar to mainnet**: Good for final testing

#### Local (Hardhat)
- **Instant mining**: Immediate transaction confirmation
- **No gas costs**: Perfect for development
- **Reset capability**: Fresh state on restart

## Deployment Process

### 1. Pre-Deployment Checks

```bash
# Verify environment setup
npx hardhat accounts

# Check network connectivity
npx hardhat console --network goerli
```

In the console:
```javascript
await ethers.provider.getNetwork()
await ethers.provider.getBalance("YOUR_WALLET_ADDRESS")
```

### 2. Deploy to Local Network

```bash
# Start local Hardhat network (in separate terminal)
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network hardhat
```

Expected output:
```
Contract deployed to address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 3. Deploy to Testnet

```bash
# Deploy to Goerli
npx hardhat run scripts/deploy.js --network goerli

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Deploy to Mainnet

```bash
# Final deployment to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

### Enhanced Deployment Script

Create an enhanced deployment script `scripts/deploy-enhanced.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
    // Get deployment account
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("=== DEPLOYMENT INFORMATION ===");
    console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);
    console.log("Deploying from account:", deployer.address);
    
    // Check balance
    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");
    
    if (balance.eq(0)) {
        throw new Error("Deployment account has no ETH balance!");
    }
    
    // Get gas price
    const gasPrice = await ethers.provider.getGasPrice();
    console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
    
    // Deploy contract
    console.log("\n=== DEPLOYING CONTRACT ===");
    const RentSystem = await ethers.getContractFactory("RentPaymentSystem");
    
    // Estimate deployment gas
    const deployTx = RentSystem.getDeployTransaction();
    const gasEstimate = await ethers.provider.estimateGas(deployTx);
    const deploymentCost = gasPrice.mul(gasEstimate);
    
    console.log("Estimated gas:", gasEstimate.toString());
    console.log("Estimated cost:", ethers.utils.formatEther(deploymentCost), "ETH");
    
    // Deploy
    const rentSystem = await RentSystem.deploy();
    console.log("Deployment transaction hash:", rentSystem.deployTransaction.hash);
    
    // Wait for confirmation
    console.log("Waiting for deployment confirmation...");
    await rentSystem.deployed();
    
    console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
    console.log("Contract address:", rentSystem.address);
    console.log("Landlord address:", deployer.address);
    console.log("Transaction hash:", rentSystem.deployTransaction.hash);
    
    // Verify deployment
    const code = await ethers.provider.getCode(rentSystem.address);
    if (code === "0x") {
        throw new Error("Contract deployment failed - no code at address");
    }
    
    // Test basic functionality
    console.log("\n=== TESTING DEPLOYMENT ===");
    const landlord = await rentSystem.landlord();
    console.log("Contract landlord:", landlord);
    console.log("Matches deployer:", landlord === deployer.address);
    
    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: network.chainId,
        contractAddress: rentSystem.address,
        landlordAddress: deployer.address,
        transactionHash: rentSystem.deployTransaction.hash,
        blockNumber: rentSystem.deployTransaction.blockNumber,
        gasUsed: gasEstimate.toString(),
        deploymentCost: ethers.utils.formatEther(deploymentCost),
        timestamp: new Date().toISOString()
    };
    
    console.log("\n=== DEPLOYMENT INFO ===");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    // Save to file
    const fs = require('fs');
    const filename = `deployment-${network.name}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\nDeployment info saved to: ${filename}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("\n=== DEPLOYMENT FAILED ===");
        console.error(error);
        process.exit(1);
    });
```

Run the enhanced deployment:
```bash
npx hardhat run scripts/deploy-enhanced.js --network goerli
```

## Post-Deployment Verification

### 1. Contract Verification on Etherscan

```bash
# Install verification plugin
npm install --save-dev @nomiclabs/hardhat-etherscan

# Verify contract
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

### 2. Functional Testing

Create a verification script `scripts/verify-deployment.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    const [deployer, testAccount] = await ethers.getSigners();
    
    // Connect to deployed contract
    const RentSystem = await ethers.getContractFactory("RentPaymentSystem");
    const contract = RentSystem.attach(contractAddress);
    
    console.log("=== VERIFYING DEPLOYMENT ===");
    console.log("Contract address:", contractAddress);
    
    // Test 1: Check landlord
    const landlord = await contract.landlord();
    console.log("Landlord:", landlord);
    console.log("Matches deployer:", landlord === deployer.address);
    
    // Test 2: Register a tenant
    const rentAmount = ethers.utils.parseEther("0.001"); // Small amount for testing
    console.log("\nRegistering test tenant...");
    
    try {
        const tx = await contract.registerTenant(testAccount.address, rentAmount);
        await tx.wait();
        console.log("✅ Tenant registration successful");
        
        // Test 3: Check tenant info
        const tenantInfo = await contract.tenants(testAccount.address);
        console.log("Tenant rent amount:", ethers.utils.formatEther(tenantInfo.rentAmount), "ETH");
        console.log("Tenant exists:", tenantInfo.exists);
        
    } catch (error) {
        console.log("❌ Tenant registration failed:", error.message);
    }
    
    console.log("\n=== VERIFICATION COMPLETE ===");
}

main().catch(console.error);
```

### 3. Monitor Deployment

```javascript
// Monitor contract events
const contract = new ethers.Contract(contractAddress, abi, provider);

contract.on("TenantRegistered", (tenant, rentAmount, event) => {
    console.log("New tenant registered:", {
        tenant,
        rentAmount: ethers.utils.formatEther(rentAmount),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
    });
});

contract.on("RentPaid", (tenant, amount, timestamp, event) => {
    console.log("Rent payment received:", {
        tenant,
        amount: ethers.utils.formatEther(amount),
        timestamp: new Date(timestamp * 1000).toISOString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
    });
});
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Insufficient funds for gas"
**Problem**: Not enough ETH in deployment account
**Solution**: 
```bash
# Check balance
npx hardhat run scripts/check-balance.js --network goerli

# Get testnet ETH from faucets
# Mainnet: Purchase ETH from exchange
```

#### 2. "Invalid API key"
**Problem**: Incorrect or missing Infura/Alchemy API key
**Solution**:
```bash
# Verify API key in .env file
# Test connection:
curl -X POST https://mainnet.infura.io/v3/YOUR_API_KEY \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

#### 3. "Gas estimation failed"
**Problem**: Contract compilation or network issues
**Solution**:
```bash
# Clean and recompile
npx hardhat clean
npx hardhat compile

# Check network connectivity
npx hardhat console --network goerli
```

#### 4. "Private key format error"
**Problem**: Incorrect private key format in .env
**Solution**:
```env
# Correct format (without 0x prefix)
PRIVATE_KEY=abcd1234...

# Incorrect format
PRIVATE_KEY=0xabcd1234...
```

#### 5. "Contract not verified"
**Problem**: Etherscan verification failed
**Solution**:
```bash
# Manual verification with constructor args
npx hardhat verify --network mainnet CONTRACT_ADDRESS

# If constructor has arguments:
npx hardhat verify --network mainnet CONTRACT_ADDRESS "arg1" "arg2"
```

### Debug Commands

```bash
# Check Hardhat configuration
npx hardhat config

# List available accounts
npx hardhat accounts --network goerli

# Get network information
npx hardhat console --network goerli
> await ethers.provider.getNetwork()

# Check gas price
npx hardhat console --network mainnet
> await ethers.provider.getGasPrice()
```

### Gas Optimization Tips

1. **Deploy during low traffic**: Use tools like ETH Gas Station to find optimal times
2. **Adjust gas price**: Lower for non-urgent deployments
3. **Optimize contract**: Enable Solidity optimizer
4. **Use CREATE2**: For deterministic addresses (advanced)

### Backup and Recovery

1. **Save deployment info**: Always save contract addresses and transaction hashes
2. **Backup private keys**: Store securely offline
3. **Document deployment**: Keep detailed records of each deployment

## Best Practices

### Pre-Deployment
- [ ] Test thoroughly on local network
- [ ] Deploy and test on testnet
- [ ] Review all configuration files
- [ ] Verify sufficient balance for deployment
- [ ] Double-check network selection

### During Deployment
- [ ] Monitor transaction status
- [ ] Save transaction hash immediately
- [ ] Verify contract address
- [ ] Test basic functionality

### Post-Deployment
- [ ] Verify contract on block explorer
- [ ] Test all major functions
- [ ] Set up monitoring
- [ ] Document deployment details
- [ ] Backup all deployment information

## Support

For deployment issues:
1. Check this troubleshooting section
2. Review Hardhat documentation
3. Check network status (Infura, Etherscan)
4. Open an issue in the repository