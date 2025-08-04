# Rent Payment System Smart Contract

A decentralized rent payment system built on Ethereum using Solidity and Hardhat. This smart contract enables landlords to register tenants and collect rent payments securely on the blockchain.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Events](#events)
- [Examples](#examples)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

The Rent Payment System is a smart contract that facilitates transparent and secure rent payments between landlords and tenants. The contract ensures that:

- Only the landlord can register new tenants
- Tenants can only pay their exact rent amount
- All payments are automatically transferred to the landlord
- Payment history is tracked and verifiable on the blockchain

## Features

- **Tenant Registration**: Landlords can register tenants with specific rent amounts
- **Secure Payments**: Tenants can pay rent directly through the smart contract
- **Automatic Transfer**: Rent payments are automatically transferred to the landlord
- **Payment Tracking**: Track payment history and timestamps
- **Access Control**: Role-based permissions for landlords and tenants
- **Event Logging**: All transactions are logged with events for transparency

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-contract-mlh
```

2. Install dependencies:
```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Configure your environment variables:
```env
API_URL_MAINNET=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_without_0x_prefix
```

**⚠️ Security Warning**: Never commit your private key to version control. Keep your `.env` file secure and add it to `.gitignore`.

## Deployment

### Local Deployment (Hardhat Network)

```bash
npx hardhat run scripts/deploy.js --network hardhat
```

### Mainnet Deployment

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

The deployment script will output the contract address. Save this address for interacting with your deployed contract.

## Usage

### For Landlords

1. **Deploy the Contract**: The deployer automatically becomes the landlord
2. **Register Tenants**: Use `registerTenant()` to add new tenants
3. **Monitor Payments**: Check payment status using view functions

### For Tenants

1. **Pay Rent**: Use `payRent()` with the exact rent amount
2. **Check Payment Status**: Use `hasPaidRent()` to verify payment status

## API Reference

### Public State Variables

#### `landlord`
```solidity
address public landlord
```
The address of the landlord who deployed the contract.

#### `tenants`
```solidity
mapping(address => Tenant) public tenants
```
Mapping that stores tenant information by their address.

### Structures

#### `Tenant`
```solidity
struct Tenant {
    uint256 rentAmount;           // Monthly rent amount in wei
    uint256 lastPaymentTimestamp; // Timestamp of last payment
    bool exists;                  // Whether tenant is registered
}
```

### Functions

#### `registerTenant(address _tenant, uint256 _rentAmount)`

Registers a new tenant with a specified rent amount.

**Access**: Only landlord
**Parameters**:
- `_tenant` (address): The tenant's Ethereum address
- `_rentAmount` (uint256): Monthly rent amount in wei

**Requirements**:
- Caller must be the landlord
- Tenant must not already be registered

**Emits**: `TenantRegistered` event

**Example**:
```javascript
// Register tenant with 1 ETH monthly rent
await contract.registerTenant("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE", ethers.utils.parseEther("1"));
```

#### `payRent()`

Allows registered tenants to pay their monthly rent.

**Access**: Only registered tenants
**Payable**: Yes - must send exact rent amount

**Requirements**:
- Caller must be a registered tenant
- Must send exact rent amount as specified during registration

**Effects**:
- Updates `lastPaymentTimestamp` for the tenant
- Transfers payment to landlord
- Emits `RentPaid` event

**Example**:
```javascript
// Tenant pays 1 ETH rent
await contract.payRent({ value: ethers.utils.parseEther("1") });
```

#### `hasPaidRent(address _tenant)`

Checks if a tenant has ever made a rent payment.

**Access**: Public view function
**Parameters**:
- `_tenant` (address): The tenant's address to check

**Returns**: `bool` - true if tenant has made at least one payment

**Example**:
```javascript
const hasPaid = await contract.hasPaidRent("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE");
console.log("Has paid rent:", hasPaid);
```

#### `getLastPaymentTimestamp(address _tenant)`

Gets the timestamp of a tenant's last rent payment.

**Access**: Public view function
**Parameters**:
- `_tenant` (address): The tenant's address

**Returns**: `uint256` - Unix timestamp of last payment (0 if never paid)

**Requirements**:
- Tenant must be registered

**Example**:
```javascript
const timestamp = await contract.getLastPaymentTimestamp("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE");
const date = new Date(timestamp * 1000);
console.log("Last payment:", date.toISOString());
```

### Modifiers

#### `onlyLandlord()`
Restricts function access to the landlord only.

#### `onlyTenant()`
Restricts function access to registered tenants only.

## Events

### `TenantRegistered`
```solidity
event TenantRegistered(address indexed tenant, uint256 rentAmount)
```
Emitted when a new tenant is registered.

**Parameters**:
- `tenant` (indexed): Address of the registered tenant
- `rentAmount`: Monthly rent amount in wei

### `RentPaid`
```solidity
event RentPaid(address indexed tenant, uint256 amount, uint256 timestamp)
```
Emitted when a tenant pays rent.

**Parameters**:
- `tenant` (indexed): Address of the tenant who paid
- `amount`: Amount paid in wei
- `timestamp`: Payment timestamp

## Examples

### Complete Integration Example

```javascript
const { ethers } = require("hardhat");

async function main() {
    // Get signers
    const [landlord, tenant1, tenant2] = await ethers.getSigners();
    
    // Deploy contract
    const RentSystem = await ethers.getContractFactory("RentPaymentSystem");
    const contract = await RentSystem.deploy();
    await contract.deployed();
    
    console.log("Contract deployed to:", contract.address);
    console.log("Landlord address:", landlord.address);
    
    // Register tenants
    const rent1 = ethers.utils.parseEther("1.0"); // 1 ETH
    const rent2 = ethers.utils.parseEther("0.5"); // 0.5 ETH
    
    await contract.registerTenant(tenant1.address, rent1);
    await contract.registerTenant(tenant2.address, rent2);
    
    console.log("Tenants registered successfully");
    
    // Tenant 1 pays rent
    await contract.connect(tenant1).payRent({ value: rent1 });
    console.log("Tenant 1 paid rent");
    
    // Check payment status
    const hasPaid = await contract.hasPaidRent(tenant1.address);
    const timestamp = await contract.getLastPaymentTimestamp(tenant1.address);
    
    console.log("Tenant 1 has paid:", hasPaid);
    console.log("Last payment timestamp:", timestamp.toString());
}

main().catch(console.error);
```

### Web3 Frontend Integration

```javascript
// Connect to contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

// Register tenant (landlord only)
async function registerTenant(tenantAddress, rentAmount) {
    try {
        const tx = await contract.registerTenant(tenantAddress, rentAmount);
        await tx.wait();
        console.log("Tenant registered successfully");
    } catch (error) {
        console.error("Registration failed:", error);
    }
}

// Pay rent (tenant only)
async function payRent(rentAmount) {
    try {
        const tx = await contract.payRent({ value: rentAmount });
        await tx.wait();
        console.log("Rent paid successfully");
    } catch (error) {
        console.error("Payment failed:", error);
    }
}

// Check payment status
async function checkPaymentStatus(tenantAddress) {
    const hasPaid = await contract.hasPaidRent(tenantAddress);
    const timestamp = await contract.getLastPaymentTimestamp(tenantAddress);
    return { hasPaid, timestamp };
}
```

## Testing

Currently, no tests are implemented. To add comprehensive testing:

1. Create a `test` directory
2. Add test files using Mocha/Chai
3. Run tests with: `npx hardhat test`

Example test structure:
```javascript
describe("RentPaymentSystem", function() {
    it("Should deploy with correct landlord", async function() {
        // Test implementation
    });
    
    it("Should register tenants correctly", async function() {
        // Test implementation
    });
    
    it("Should process rent payments", async function() {
        // Test implementation
    });
});
```

## Security Considerations

- **Access Control**: The contract uses modifiers to ensure only authorized users can perform specific actions
- **Reentrancy**: The contract uses `transfer()` which limits gas and prevents reentrancy attacks
- **Input Validation**: All functions validate inputs and check requirements
- **Event Logging**: All important actions emit events for transparency

## Gas Optimization

- Functions use `storage` references where appropriate to minimize gas costs
- Events are indexed for efficient filtering
- Minimal state changes in functions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Support

For questions or support, please open an issue in the repository. 
