# 📚 RentPaymentSystem Documentation

Welcome to the comprehensive documentation for the RentPaymentSystem smart contract. This documentation covers everything you need to understand, deploy, and integrate with the rent payment system.

## 📋 Table of Contents

### Quick Start
- [🏠 Main README](../README.md) - Project overview and quick setup
- [🚀 Deployment Guide](DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions
- [💡 Usage Examples](USAGE_EXAMPLES.md) - Integration examples and code samples

### Technical Reference
- [📖 API Reference](API_REFERENCE.md) - Complete technical documentation
- [🔧 Smart Contract Source](../contracts/contract.sol) - The actual smart contract code

## 🎯 What is RentPaymentSystem?

RentPaymentSystem is a decentralized smart contract built on Ethereum that facilitates transparent and secure rent payments between landlords and tenants. The system ensures:

- **Trustless Payments**: No intermediaries required
- **Transparent Records**: All transactions recorded on blockchain
- **Automated Processing**: Payments automatically transferred to landlord
- **Access Control**: Role-based permissions for security
- **Event Logging**: Real-time notifications for all activities

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    Landlord     │    │  Smart Contract  │    │     Tenant      │
│                 │    │                  │    │                 │
│ • Deploy        │────│ • registerTenant │────│ • Pay Rent      │
│ • Register      │    │ • Store Info     │    │ • Check Status  │
│ • Monitor       │    │ • Transfer ETH   │    │ • View History  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Getting Started

### For Developers

1. **Read the [Main README](../README.md)** for project overview and setup
2. **Follow the [Deployment Guide](DEPLOYMENT_GUIDE.md)** to deploy your own instance
3. **Explore [Usage Examples](USAGE_EXAMPLES.md)** for integration patterns
4. **Reference the [API Documentation](API_REFERENCE.md)** for detailed technical specs

### For Landlords

1. Deploy the smart contract (you become the landlord automatically)
2. Register tenants with their rent amounts
3. Monitor payments through events or web interface
4. Receive automatic ETH transfers when tenants pay

### For Tenants

1. Get registered by your landlord
2. Pay rent by sending the exact amount to the contract
3. Check your payment history and status
4. Receive confirmation through blockchain events

## 📚 Documentation Structure

### 🏠 [Main README](../README.md)
**Start here for project overview**
- Project description and features
- Installation and setup instructions
- Basic usage examples
- Configuration guide
- Security considerations

### 🚀 [Deployment Guide](DEPLOYMENT_GUIDE.md)
**Complete deployment walkthrough**
- Environment setup and prerequisites
- Network configuration (mainnet, testnets, local)
- Step-by-step deployment process
- Post-deployment verification
- Troubleshooting common issues

### 💡 [Usage Examples](USAGE_EXAMPLES.md)
**Practical integration examples**
- Node.js integration with complete service class
- Web application with HTML/JavaScript
- React.js component examples
- Express.js API server
- Real-time event monitoring
- Comprehensive testing examples

### 📖 [API Reference](API_REFERENCE.md)
**Complete technical documentation**
- All functions with parameters and return values
- Event definitions and usage
- Error handling and common issues
- Gas estimates and optimization tips
- Security considerations
- Integration patterns

## 🔧 Core Functions

### For Landlords
- `registerTenant(address, uint256)` - Register new tenant with rent amount
- View all tenants and their payment status
- Monitor payment events in real-time

### For Tenants
- `payRent()` - Pay monthly rent (payable function)
- `hasPaidRent(address)` - Check if tenant has paid
- `getLastPaymentTimestamp(address)` - Get last payment date

### For Everyone
- View contract state and tenant information
- Listen to events for real-time updates
- Query payment history

## 🎯 Key Features

### 🔒 Security Features
- **Access Control**: Only landlord can register tenants
- **Exact Payments**: Tenants must pay exact rent amount
- **Reentrancy Protection**: Uses `transfer()` for safe ETH handling
- **Input Validation**: All functions validate parameters

### 📊 Transparency
- **Event Logging**: All actions emit events
- **Public State**: Tenant information is publicly readable
- **Blockchain Records**: Immutable payment history

### ⚡ Efficiency
- **Gas Optimized**: Minimal storage operations
- **Simple Interface**: Easy to understand and use
- **No Intermediaries**: Direct landlord-tenant interaction

## 🛠️ Integration Options

### Frontend Integration
- **Web3 Wallets**: MetaMask, WalletConnect
- **React/Vue/Angular**: Component examples provided
- **Vanilla JavaScript**: Direct HTML integration

### Backend Integration
- **Node.js**: Complete service class examples
- **Express.js**: REST API implementation
- **Event Monitoring**: Real-time notification systems

### Mobile Integration
- **React Native**: Use ethers.js with React Native
- **Web3 Providers**: Mobile wallet integration
- **Push Notifications**: Event-driven updates

## 📋 Quick Reference

### Contract Address
```
Mainnet: [Deploy and update here]
Goerli:  [Deploy and update here]
Sepolia: [Deploy and update here]
```

### Essential Commands
```bash
# Install dependencies
npm install

# Compile contract
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network hardhat

# Deploy to testnet
npx hardhat run scripts/deploy.js --network goerli

# Verify on Etherscan
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

### Key Events
```solidity
event TenantRegistered(address indexed tenant, uint256 rentAmount);
event RentPaid(address indexed tenant, uint256 amount, uint256 timestamp);
```

## 🤝 Support and Community

### Getting Help
1. **Check Documentation**: Start with this comprehensive guide
2. **Review Examples**: Look at usage examples for your use case
3. **Search Issues**: Check existing GitHub issues
4. **Create Issue**: Open a new issue for bugs or questions

### Contributing
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

### Best Practices
- Always test on testnets first
- Use proper error handling in integrations
- Monitor gas prices for cost optimization
- Keep private keys secure and never commit them

## 📊 Project Stats

- **Contract Size**: ~2KB
- **Functions**: 6 public functions  
- **Events**: 2 events
- **Dependencies**: Minimal (Solidity 0.7.3)
- **Gas Usage**: Optimized for efficiency

## 🔗 Useful Links

- **Ethereum**: https://ethereum.org/
- **Hardhat**: https://hardhat.org/
- **Ethers.js**: https://docs.ethers.io/
- **OpenZeppelin**: https://openzeppelin.com/
- **Solidity**: https://docs.soliditylang.org/

## 📄 License

This project is licensed under the ISC License - see the [package.json](../package.json) file for details.

---

**Ready to get started?** Begin with the [Main README](../README.md) or jump straight to the [Deployment Guide](DEPLOYMENT_GUIDE.md) if you're ready to deploy!

For questions or support, please open an issue in the repository.