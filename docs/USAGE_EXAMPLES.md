# Usage Examples and Integration Guide

This document provides comprehensive examples for integrating and using the RentPaymentSystem smart contract in various environments.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Node.js Integration](#nodejs-integration)
- [Web Application Integration](#web-application-integration)
- [React.js Example](#reactjs-example)
- [Backend API Integration](#backend-api-integration)
- [Event Monitoring](#event-monitoring)
- [Testing Examples](#testing-examples)
- [Advanced Use Cases](#advanced-use-cases)

## Basic Usage

### Contract ABI

First, you'll need the contract ABI. Generate it after compilation:

```bash
npx hardhat compile
```

The ABI will be available in `artifacts/contracts/contract.sol/RentPaymentSystem.json`.

### Basic Connection

```javascript
const { ethers } = require("ethers");

// Contract details
const contractAddress = "0x..."; // Your deployed contract address
const contractABI = [
    // ABI array from compilation artifacts
];

// Connect to provider
const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_KEY");
const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const contract = new ethers.Contract(contractAddress, contractABI, signer);
```

## Node.js Integration

### Complete Node.js Example

```javascript
const { ethers } = require("ethers");
require('dotenv').config();

class RentPaymentService {
    constructor(contractAddress, providerUrl, privateKey) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
        this.signer = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(contractAddress, this.getABI(), this.signer);
    }

    getABI() {
        return [
            "function landlord() view returns (address)",
            "function tenants(address) view returns (uint256 rentAmount, uint256 lastPaymentTimestamp, bool exists)",
            "function registerTenant(address _tenant, uint256 _rentAmount)",
            "function payRent() payable",
            "function hasPaidRent(address _tenant) view returns (bool)",
            "function getLastPaymentTimestamp(address _tenant) view returns (uint256)",
            "event TenantRegistered(address indexed tenant, uint256 rentAmount)",
            "event RentPaid(address indexed tenant, uint256 amount, uint256 timestamp)"
        ];
    }

    async registerTenant(tenantAddress, rentAmountETH) {
        try {
            const rentAmount = ethers.utils.parseEther(rentAmountETH.toString());
            const tx = await this.contract.registerTenant(tenantAddress, rentAmount);
            const receipt = await tx.wait();
            
            console.log(`Tenant ${tenantAddress} registered successfully`);
            console.log(`Transaction hash: ${receipt.transactionHash}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);
            
            return receipt;
        } catch (error) {
            console.error("Registration failed:", error.message);
            throw error;
        }
    }

    async payRent(rentAmountETH) {
        try {
            const rentAmount = ethers.utils.parseEther(rentAmountETH.toString());
            const tx = await this.contract.payRent({ value: rentAmount });
            const receipt = await tx.wait();
            
            console.log("Rent paid successfully");
            console.log(`Transaction hash: ${receipt.transactionHash}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);
            
            return receipt;
        } catch (error) {
            console.error("Payment failed:", error.message);
            throw error;
        }
    }

    async getTenantInfo(tenantAddress) {
        try {
            const tenantInfo = await this.contract.tenants(tenantAddress);
            const hasPaid = await this.contract.hasPaidRent(tenantAddress);
            
            return {
                address: tenantAddress,
                rentAmount: ethers.utils.formatEther(tenantInfo.rentAmount),
                lastPaymentTimestamp: tenantInfo.lastPaymentTimestamp.toNumber(),
                exists: tenantInfo.exists,
                hasPaid: hasPaid,
                lastPaymentDate: tenantInfo.lastPaymentTimestamp.toNumber() > 0 
                    ? new Date(tenantInfo.lastPaymentTimestamp.toNumber() * 1000)
                    : null
            };
        } catch (error) {
            console.error("Failed to get tenant info:", error.message);
            throw error;
        }
    }

    async getAllTenants() {
        // Note: This requires tracking registered tenants off-chain
        // or listening to TenantRegistered events
        const filter = this.contract.filters.TenantRegistered();
        const events = await this.contract.queryFilter(filter);
        
        const tenants = [];
        for (const event of events) {
            const tenantInfo = await this.getTenantInfo(event.args.tenant);
            tenants.push(tenantInfo);
        }
        
        return tenants;
    }

    async getPaymentHistory(tenantAddress = null) {
        const filter = tenantAddress 
            ? this.contract.filters.RentPaid(tenantAddress)
            : this.contract.filters.RentPaid();
            
        const events = await this.contract.queryFilter(filter);
        
        return events.map(event => ({
            tenant: event.args.tenant,
            amount: ethers.utils.formatEther(event.args.amount),
            timestamp: event.args.timestamp.toNumber(),
            date: new Date(event.args.timestamp.toNumber() * 1000),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber
        }));
    }

    setupEventListeners() {
        this.contract.on("TenantRegistered", (tenant, rentAmount, event) => {
            console.log("🏠 New tenant registered:", {
                tenant,
                rentAmount: ethers.utils.formatEther(rentAmount),
                transactionHash: event.transactionHash
            });
        });

        this.contract.on("RentPaid", (tenant, amount, timestamp, event) => {
            console.log("💰 Rent payment received:", {
                tenant,
                amount: ethers.utils.formatEther(amount),
                date: new Date(timestamp * 1000).toISOString(),
                transactionHash: event.transactionHash
            });
        });
    }
}

// Usage example
async function main() {
    const service = new RentPaymentService(
        process.env.CONTRACT_ADDRESS,
        process.env.PROVIDER_URL,
        process.env.PRIVATE_KEY
    );

    // Set up event listeners
    service.setupEventListeners();

    // Register a tenant
    await service.registerTenant(
        "0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE",
        1.0 // 1 ETH rent
    );

    // Get tenant info
    const tenantInfo = await service.getTenantInfo("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE");
    console.log("Tenant info:", tenantInfo);

    // Get all tenants
    const allTenants = await service.getAllTenants();
    console.log("All tenants:", allTenants);

    // Get payment history
    const paymentHistory = await service.getPaymentHistory();
    console.log("Payment history:", paymentHistory);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = RentPaymentService;
```

### Package.json for Node.js Project

```json
{
    "name": "rent-payment-client",
    "version": "1.0.0",
    "description": "Client for RentPaymentSystem smart contract",
    "main": "index.js",
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
    },
    "dependencies": {
        "ethers": "^5.7.2",
        "dotenv": "^16.0.3"
    },
    "devDependencies": {
        "nodemon": "^2.0.20"
    }
}
```

## Web Application Integration

### Basic HTML/JavaScript Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rent Payment System</title>
    <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    </style>
</head>
<body>
    <h1>🏠 Rent Payment System</h1>
    
    <div class="section">
        <h2>Connect Wallet</h2>
        <button onclick="connectWallet()">Connect MetaMask</button>
        <div id="walletStatus" class="status info" style="display: none;"></div>
    </div>

    <div class="section">
        <h2>Landlord Functions</h2>
        <div>
            <input type="text" id="tenantAddress" placeholder="Tenant Address">
            <input type="number" id="rentAmount" placeholder="Rent Amount (ETH)" step="0.01">
            <button onclick="registerTenant()">Register Tenant</button>
        </div>
    </div>

    <div class="section">
        <h2>Tenant Functions</h2>
        <div>
            <input type="number" id="paymentAmount" placeholder="Payment Amount (ETH)" step="0.01">
            <button onclick="payRent()">Pay Rent</button>
        </div>
    </div>

    <div class="section">
        <h2>Information</h2>
        <button onclick="getTenantInfo()">Get My Tenant Info</button>
        <button onclick="getPaymentHistory()">Get Payment History</button>
        <div id="infoDisplay"></div>
    </div>

    <div class="section">
        <h2>Recent Events</h2>
        <div id="eventLog"></div>
    </div>

    <script>
        const CONTRACT_ADDRESS = "0x..."; // Your contract address
        const CONTRACT_ABI = [
            "function landlord() view returns (address)",
            "function tenants(address) view returns (uint256 rentAmount, uint256 lastPaymentTimestamp, bool exists)",
            "function registerTenant(address _tenant, uint256 _rentAmount)",
            "function payRent() payable",
            "function hasPaidRent(address _tenant) view returns (bool)",
            "function getLastPaymentTimestamp(address _tenant) view returns (uint256)",
            "event TenantRegistered(address indexed tenant, uint256 rentAmount)",
            "event RentPaid(address indexed tenant, uint256 amount, uint256 timestamp)"
        ];

        let provider, signer, contract, userAddress;

        async function connectWallet() {
            try {
                if (typeof window.ethereum !== 'undefined') {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    signer = provider.getSigner();
                    userAddress = await signer.getAddress();
                    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                    document.getElementById('walletStatus').innerHTML = `Connected: ${userAddress}`;
                    document.getElementById('walletStatus').style.display = 'block';

                    setupEventListeners();
                    showStatus('Wallet connected successfully!', 'success');
                } else {
                    showStatus('MetaMask not found. Please install MetaMask.', 'error');
                }
            } catch (error) {
                showStatus(`Connection failed: ${error.message}`, 'error');
            }
        }

        async function registerTenant() {
            try {
                const tenantAddress = document.getElementById('tenantAddress').value;
                const rentAmount = document.getElementById('rentAmount').value;

                if (!tenantAddress || !rentAmount) {
                    showStatus('Please fill in all fields', 'error');
                    return;
                }

                const tx = await contract.registerTenant(
                    tenantAddress,
                    ethers.utils.parseEther(rentAmount)
                );

                showStatus('Transaction submitted. Waiting for confirmation...', 'info');
                const receipt = await tx.wait();
                showStatus(`Tenant registered successfully! TX: ${receipt.transactionHash}`, 'success');

                // Clear inputs
                document.getElementById('tenantAddress').value = '';
                document.getElementById('rentAmount').value = '';
            } catch (error) {
                showStatus(`Registration failed: ${error.message}`, 'error');
            }
        }

        async function payRent() {
            try {
                const paymentAmount = document.getElementById('paymentAmount').value;

                if (!paymentAmount) {
                    showStatus('Please enter payment amount', 'error');
                    return;
                }

                const tx = await contract.payRent({
                    value: ethers.utils.parseEther(paymentAmount)
                });

                showStatus('Payment submitted. Waiting for confirmation...', 'info');
                const receipt = await tx.wait();
                showStatus(`Rent paid successfully! TX: ${receipt.transactionHash}`, 'success');

                // Clear input
                document.getElementById('paymentAmount').value = '';
            } catch (error) {
                showStatus(`Payment failed: ${error.message}`, 'error');
            }
        }

        async function getTenantInfo() {
            try {
                const tenantInfo = await contract.tenants(userAddress);
                const hasPaid = await contract.hasPaidRent(userAddress);

                const info = `
                    <h3>Your Tenant Information</h3>
                    <p><strong>Registered:</strong> ${tenantInfo.exists ? 'Yes' : 'No'}</p>
                    <p><strong>Rent Amount:</strong> ${ethers.utils.formatEther(tenantInfo.rentAmount)} ETH</p>
                    <p><strong>Has Paid:</strong> ${hasPaid ? 'Yes' : 'No'}</p>
                    <p><strong>Last Payment:</strong> ${tenantInfo.lastPaymentTimestamp > 0 
                        ? new Date(tenantInfo.lastPaymentTimestamp * 1000).toLocaleString()
                        : 'Never'}</p>
                `;

                document.getElementById('infoDisplay').innerHTML = info;
            } catch (error) {
                showStatus(`Failed to get tenant info: ${error.message}`, 'error');
            }
        }

        async function getPaymentHistory() {
            try {
                const filter = contract.filters.RentPaid(userAddress);
                const events = await contract.queryFilter(filter);

                let historyHTML = '<h3>Your Payment History</h3>';
                
                if (events.length === 0) {
                    historyHTML += '<p>No payments found.</p>';
                } else {
                    historyHTML += '<ul>';
                    events.forEach(event => {
                        const date = new Date(event.args.timestamp * 1000).toLocaleString();
                        const amount = ethers.utils.formatEther(event.args.amount);
                        historyHTML += `<li>${date}: ${amount} ETH (TX: ${event.transactionHash.substring(0, 10)}...)</li>`;
                    });
                    historyHTML += '</ul>';
                }

                document.getElementById('infoDisplay').innerHTML = historyHTML;
            } catch (error) {
                showStatus(`Failed to get payment history: ${error.message}`, 'error');
            }
        }

        function setupEventListeners() {
            contract.on("TenantRegistered", (tenant, rentAmount, event) => {
                const message = `🏠 New tenant registered: ${tenant} (${ethers.utils.formatEther(rentAmount)} ETH)`;
                addEventLog(message, event.transactionHash);
            });

            contract.on("RentPaid", (tenant, amount, timestamp, event) => {
                const date = new Date(timestamp * 1000).toLocaleString();
                const message = `💰 Rent paid: ${ethers.utils.formatEther(amount)} ETH by ${tenant} at ${date}`;
                addEventLog(message, event.transactionHash);
            });
        }

        function addEventLog(message, txHash) {
            const eventLog = document.getElementById('eventLog');
            const eventDiv = document.createElement('div');
            eventDiv.innerHTML = `
                <p>${message}</p>
                <small>TX: <a href="https://etherscan.io/tx/${txHash}" target="_blank">${txHash.substring(0, 20)}...</a></small>
                <hr>
            `;
            eventLog.insertBefore(eventDiv, eventLog.firstChild);
        }

        function showStatus(message, type) {
            const statusDiv = document.createElement('div');
            statusDiv.className = `status ${type}`;
            statusDiv.textContent = message;
            
            // Remove existing status messages
            document.querySelectorAll('.status:not(#walletStatus)').forEach(el => el.remove());
            
            // Add new status message
            document.body.insertBefore(statusDiv, document.body.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => statusDiv.remove(), 5000);
        }

        // Auto-connect if MetaMask is already connected
        window.addEventListener('load', async () => {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    connectWallet();
                }
            }
        });
    </script>
</body>
</html>
```

## React.js Example

### React Component

```jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x..."; // Your contract address
const CONTRACT_ABI = [
    "function landlord() view returns (address)",
    "function tenants(address) view returns (uint256 rentAmount, uint256 lastPaymentTimestamp, bool exists)",
    "function registerTenant(address _tenant, uint256 _rentAmount)",
    "function payRent() payable",
    "function hasPaidRent(address _tenant) view returns (bool)",
    "function getLastPaymentTimestamp(address _tenant) view returns (uint256)",
    "event TenantRegistered(address indexed tenant, uint256 rentAmount)",
    "event RentPaid(address indexed tenant, uint256 amount, uint256 timestamp)"
];

function RentPaymentApp() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [isLandlord, setIsLandlord] = useState(false);
    const [tenantInfo, setTenantInfo] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    // Form states
    const [tenantAddress, setTenantAddress] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');

    useEffect(() => {
        connectWallet();
    }, []);

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                setProvider(provider);
                setSigner(signer);
                setContract(contract);
                setUserAddress(userAddress);

                // Check if user is landlord
                const landlordAddress = await contract.landlord();
                setIsLandlord(landlordAddress.toLowerCase() === userAddress.toLowerCase());

                // Get tenant info
                await getTenantInfo(contract, userAddress);

                // Setup event listeners
                setupEventListeners(contract);

                setStatus('Wallet connected successfully!');
            } else {
                setStatus('MetaMask not found');
            }
        } catch (error) {
            setStatus(`Connection failed: ${error.message}`);
        }
    };

    const getTenantInfo = async (contractInstance = contract, address = userAddress) => {
        try {
            const info = await contractInstance.tenants(address);
            const hasPaid = await contractInstance.hasPaidRent(address);
            
            setTenantInfo({
                exists: info.exists,
                rentAmount: ethers.utils.formatEther(info.rentAmount),
                lastPaymentTimestamp: info.lastPaymentTimestamp.toNumber(),
                hasPaid: hasPaid
            });
        } catch (error) {
            console.error('Failed to get tenant info:', error);
        }
    };

    const setupEventListeners = (contractInstance) => {
        contractInstance.on("TenantRegistered", (tenant, rentAmount, event) => {
            const newEvent = {
                type: 'TenantRegistered',
                tenant,
                amount: ethers.utils.formatEther(rentAmount),
                timestamp: Date.now(),
                txHash: event.transactionHash
            };
            setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
        });

        contractInstance.on("RentPaid", (tenant, amount, timestamp, event) => {
            const newEvent = {
                type: 'RentPaid',
                tenant,
                amount: ethers.utils.formatEther(amount),
                timestamp: timestamp * 1000,
                txHash: event.transactionHash
            };
            setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
            
            // Refresh tenant info if it's the current user
            if (tenant.toLowerCase() === userAddress.toLowerCase()) {
                getTenantInfo();
            }
        });
    };

    const registerTenant = async () => {
        try {
            setLoading(true);
            setStatus('Registering tenant...');

            const tx = await contract.registerTenant(
                tenantAddress,
                ethers.utils.parseEther(rentAmount)
            );

            setStatus('Transaction submitted. Waiting for confirmation...');
            await tx.wait();
            
            setStatus('Tenant registered successfully!');
            setTenantAddress('');
            setRentAmount('');
        } catch (error) {
            setStatus(`Registration failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const payRent = async () => {
        try {
            setLoading(true);
            setStatus('Processing payment...');

            const tx = await contract.payRent({
                value: ethers.utils.parseEther(paymentAmount)
            });

            setStatus('Payment submitted. Waiting for confirmation...');
            await tx.wait();
            
            setStatus('Rent paid successfully!');
            setPaymentAmount('');
        } catch (error) {
            setStatus(`Payment failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>🏠 Rent Payment System</h1>
            
            {/* Status */}
            {status && (
                <div style={{ 
                    padding: '10px', 
                    margin: '10px 0', 
                    backgroundColor: '#d1ecf1', 
                    border: '1px solid #bee5eb',
                    borderRadius: '4px'
                }}>
                    {status}
                </div>
            )}

            {/* User Info */}
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>Account Information</h3>
                <p><strong>Address:</strong> {userAddress}</p>
                <p><strong>Role:</strong> {isLandlord ? 'Landlord' : 'Tenant'}</p>
                
                {tenantInfo && (
                    <div>
                        <p><strong>Registered as Tenant:</strong> {tenantInfo.exists ? 'Yes' : 'No'}</p>
                        {tenantInfo.exists && (
                            <>
                                <p><strong>Rent Amount:</strong> {tenantInfo.rentAmount} ETH</p>
                                <p><strong>Has Paid:</strong> {tenantInfo.hasPaid ? 'Yes' : 'No'}</p>
                                <p><strong>Last Payment:</strong> {
                                    tenantInfo.lastPaymentTimestamp > 0 
                                        ? new Date(tenantInfo.lastPaymentTimestamp * 1000).toLocaleString()
                                        : 'Never'
                                }</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Landlord Functions */}
            {isLandlord && (
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>Landlord Functions</h3>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Tenant Address"
                            value={tenantAddress}
                            onChange={(e) => setTenantAddress(e.target.value)}
                            style={{ padding: '8px', margin: '5px', width: '300px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="number"
                            placeholder="Rent Amount (ETH)"
                            step="0.01"
                            value={rentAmount}
                            onChange={(e) => setRentAmount(e.target.value)}
                            style={{ padding: '8px', margin: '5px', width: '200px' }}
                        />
                    </div>
                    <button
                        onClick={registerTenant}
                        disabled={loading || !tenantAddress || !rentAmount}
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Registering...' : 'Register Tenant'}
                    </button>
                </div>
            )}

            {/* Tenant Functions */}
            {tenantInfo?.exists && (
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>Pay Rent</h3>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="number"
                            placeholder={`Payment Amount (${tenantInfo.rentAmount} ETH)`}
                            step="0.01"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            style={{ padding: '8px', margin: '5px', width: '200px' }}
                        />
                    </div>
                    <button
                        onClick={payRent}
                        disabled={loading || !paymentAmount}
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Processing...' : 'Pay Rent'}
                    </button>
                </div>
            )}

            {/* Recent Events */}
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>Recent Events</h3>
                {events.length === 0 ? (
                    <p>No recent events</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {events.map((event, index) => (
                            <li key={index} style={{ 
                                padding: '10px', 
                                margin: '5px 0', 
                                backgroundColor: '#f8f9fa', 
                                borderRadius: '4px' 
                            }}>
                                <strong>
                                    {event.type === 'TenantRegistered' ? '🏠' : '💰'} 
                                    {event.type === 'TenantRegistered' ? ' Tenant Registered' : ' Rent Paid'}
                                </strong>
                                <br />
                                Tenant: {event.tenant}
                                <br />
                                Amount: {event.amount} ETH
                                <br />
                                Time: {new Date(event.timestamp).toLocaleString()}
                                <br />
                                <small>TX: {event.txHash.substring(0, 20)}...</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default RentPaymentApp;
```

### React Package.json

```json
{
    "name": "rent-payment-frontend",
    "version": "1.0.0",
    "private": true,
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "ethers": "^5.7.2"
    },
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    },
    "devDependencies": {
        "react-scripts": "5.0.1"
    }
}
```

## Backend API Integration

### Express.js API Server

```javascript
const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(express.json());

// Contract configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = [
    "function landlord() view returns (address)",
    "function tenants(address) view returns (uint256 rentAmount, uint256 lastPaymentTimestamp, bool exists)",
    "function registerTenant(address _tenant, uint256 _rentAmount)",
    "function payRent() payable",
    "function hasPaidRent(address _tenant) view returns (bool)",
    "function getLastPaymentTimestamp(address _tenant) view returns (uint256)",
    "event TenantRegistered(address indexed tenant, uint256 rentAmount)",
    "event RentPaid(address indexed tenant, uint256 amount, uint256 timestamp)"
];

// Provider and contract setup
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const landlordWallet = new ethers.Wallet(process.env.LANDLORD_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, landlordWallet);

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes

// Get contract information
app.get('/api/contract/info', asyncHandler(async (req, res) => {
    const landlord = await contract.landlord();
    const network = await provider.getNetwork();
    
    res.json({
        contractAddress: CONTRACT_ADDRESS,
        landlord,
        network: network.name,
        chainId: network.chainId
    });
}));

// Register a new tenant (landlord only)
app.post('/api/tenants/register', asyncHandler(async (req, res) => {
    const { tenantAddress, rentAmountETH } = req.body;
    
    if (!tenantAddress || !rentAmountETH) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ethers.utils.isAddress(tenantAddress)) {
        return res.status(400).json({ error: 'Invalid tenant address' });
    }

    const rentAmount = ethers.utils.parseEther(rentAmountETH.toString());
    const tx = await contract.registerTenant(tenantAddress, rentAmount);
    const receipt = await tx.wait();

    res.json({
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        tenant: tenantAddress,
        rentAmount: rentAmountETH
    });
}));

// Get tenant information
app.get('/api/tenants/:address', asyncHandler(async (req, res) => {
    const { address } = req.params;
    
    if (!ethers.utils.isAddress(address)) {
        return res.status(400).json({ error: 'Invalid address' });
    }

    const tenantInfo = await contract.tenants(address);
    const hasPaid = await contract.hasPaidRent(address);

    res.json({
        address,
        exists: tenantInfo.exists,
        rentAmount: ethers.utils.formatEther(tenantInfo.rentAmount),
        lastPaymentTimestamp: tenantInfo.lastPaymentTimestamp.toNumber(),
        lastPaymentDate: tenantInfo.lastPaymentTimestamp.toNumber() > 0 
            ? new Date(tenantInfo.lastPaymentTimestamp.toNumber() * 1000).toISOString()
            : null,
        hasPaid
    });
}));

// Get all registered tenants
app.get('/api/tenants', asyncHandler(async (req, res) => {
    const filter = contract.filters.TenantRegistered();
    const events = await contract.queryFilter(filter);
    
    const tenants = [];
    for (const event of events) {
        const tenantInfo = await contract.tenants(event.args.tenant);
        const hasPaid = await contract.hasPaidRent(event.args.tenant);
        
        tenants.push({
            address: event.args.tenant,
            rentAmount: ethers.utils.formatEther(tenantInfo.rentAmount),
            lastPaymentTimestamp: tenantInfo.lastPaymentTimestamp.toNumber(),
            lastPaymentDate: tenantInfo.lastPaymentTimestamp.toNumber() > 0 
                ? new Date(tenantInfo.lastPaymentTimestamp.toNumber() * 1000).toISOString()
                : null,
            hasPaid,
            registrationTx: event.transactionHash,
            registrationBlock: event.blockNumber
        });
    }

    res.json(tenants);
}));

// Get payment history
app.get('/api/payments', asyncHandler(async (req, res) => {
    const { tenant } = req.query;
    
    const filter = tenant 
        ? contract.filters.RentPaid(tenant)
        : contract.filters.RentPaid();
        
    const events = await contract.queryFilter(filter);
    
    const payments = events.map(event => ({
        tenant: event.args.tenant,
        amount: ethers.utils.formatEther(event.args.amount),
        timestamp: event.args.timestamp.toNumber(),
        date: new Date(event.args.timestamp.toNumber() * 1000).toISOString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
    }));

    res.json(payments);
}));

// Get payment statistics
app.get('/api/stats', asyncHandler(async (req, res) => {
    const [tenantEvents, paymentEvents] = await Promise.all([
        contract.queryFilter(contract.filters.TenantRegistered()),
        contract.queryFilter(contract.filters.RentPaid())
    ]);

    const totalTenants = tenantEvents.length;
    const totalPayments = paymentEvents.length;
    const totalAmountCollected = paymentEvents.reduce((sum, event) => {
        return sum.add(event.args.amount);
    }, ethers.BigNumber.from(0));

    // Calculate monthly statistics
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthPayments = paymentEvents.filter(event => {
        const paymentDate = new Date(event.args.timestamp.toNumber() * 1000);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    const thisMonthAmount = thisMonthPayments.reduce((sum, event) => {
        return sum.add(event.args.amount);
    }, ethers.BigNumber.from(0));

    res.json({
        totalTenants,
        totalPayments,
        totalAmountCollected: ethers.utils.formatEther(totalAmountCollected),
        thisMonth: {
            payments: thisMonthPayments.length,
            amount: ethers.utils.formatEther(thisMonthAmount)
        }
    });
}));

// Webhook endpoint for real-time updates
app.post('/api/webhook/payment', asyncHandler(async (req, res) => {
    // This would be called by your event monitoring service
    const { tenant, amount, timestamp, transactionHash } = req.body;
    
    // Process the payment notification
    // You could send emails, update databases, etc.
    
    console.log(`Payment received: ${amount} ETH from ${tenant}`);
    
    res.json({ success: true });
}));

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Rent Payment API server running on port ${PORT}`);
});

module.exports = app;
```

## Event Monitoring

### Real-time Event Monitor

```javascript
const { ethers } = require('ethers');
const EventEmitter = require('events');

class RentPaymentMonitor extends EventEmitter {
    constructor(contractAddress, providerUrl, contractABI) {
        super();
        this.contractAddress = contractAddress;
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
        this.contract = new ethers.Contract(contractAddress, contractABI, this.provider);
        this.isMonitoring = false;
    }

    async startMonitoring() {
        if (this.isMonitoring) {
            console.log('Already monitoring events');
            return;
        }

        console.log('Starting event monitoring...');
        this.isMonitoring = true;

        // Listen for new tenant registrations
        this.contract.on("TenantRegistered", async (tenant, rentAmount, event) => {
            const eventData = {
                type: 'TenantRegistered',
                tenant,
                rentAmount: ethers.utils.formatEther(rentAmount),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
                timestamp: Date.now()
            };

            console.log('🏠 New tenant registered:', eventData);
            this.emit('tenantRegistered', eventData);

            // Send notification
            await this.sendNotification('tenant_registered', eventData);
        });

        // Listen for rent payments
        this.contract.on("RentPaid", async (tenant, amount, timestamp, event) => {
            const eventData = {
                type: 'RentPaid',
                tenant,
                amount: ethers.utils.formatEther(amount),
                paymentTimestamp: timestamp.toNumber(),
                paymentDate: new Date(timestamp.toNumber() * 1000).toISOString(),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
                detectedAt: Date.now()
            };

            console.log('💰 Rent payment received:', eventData);
            this.emit('rentPaid', eventData);

            // Send notification
            await this.sendNotification('rent_paid', eventData);
        });

        // Monitor for contract errors
        this.provider.on('error', (error) => {
            console.error('Provider error:', error);
            this.emit('error', error);
        });

        console.log('Event monitoring started successfully');
    }

    stopMonitoring() {
        if (!this.isMonitoring) {
            console.log('Not currently monitoring');
            return;
        }

        console.log('Stopping event monitoring...');
        this.contract.removeAllListeners();
        this.provider.removeAllListeners();
        this.isMonitoring = false;
        console.log('Event monitoring stopped');
    }

    async sendNotification(type, data) {
        try {
            switch (type) {
                case 'tenant_registered':
                    await this.notifyTenantRegistered(data);
                    break;
                case 'rent_paid':
                    await this.notifyRentPaid(data);
                    break;
            }
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    async notifyTenantRegistered(data) {
        // Example: Send email notification
        console.log(`📧 Sending tenant registration notification for ${data.tenant}`);
        
        // You could integrate with:
        // - Email service (SendGrid, AWS SES)
        // - Slack/Discord webhooks
        // - Push notifications
        // - Database logging
    }

    async notifyRentPaid(data) {
        // Example: Send payment confirmation
        console.log(`📧 Sending payment confirmation for ${data.amount} ETH from ${data.tenant}`);
        
        // You could integrate with:
        // - Receipt generation
        // - Accounting system updates
        // - Payment confirmations
        // - Late payment tracking
    }

    async getHistoricalEvents(fromBlock = 0) {
        console.log('Fetching historical events...');
        
        const [tenantEvents, paymentEvents] = await Promise.all([
            this.contract.queryFilter(this.contract.filters.TenantRegistered(), fromBlock),
            this.contract.queryFilter(this.contract.filters.RentPaid(), fromBlock)
        ]);

        return {
            tenantRegistrations: tenantEvents.map(event => ({
                tenant: event.args.tenant,
                rentAmount: ethers.utils.formatEther(event.args.rentAmount),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            })),
            payments: paymentEvents.map(event => ({
                tenant: event.args.tenant,
                amount: ethers.utils.formatEther(event.args.amount),
                timestamp: event.args.timestamp.toNumber(),
                date: new Date(event.args.timestamp.toNumber() * 1000).toISOString(),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            }))
        };
    }

    async generateReport(period = '30d') {
        const now = Date.now();
        const periodMs = {
            '1d': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
            '90d': 90 * 24 * 60 * 60 * 1000
        };

        const fromTime = now - (periodMs[period] || periodMs['30d']);
        const fromBlock = await this.getBlockFromTimestamp(fromTime / 1000);
        
        const events = await this.getHistoricalEvents(fromBlock);
        
        const report = {
            period,
            fromDate: new Date(fromTime).toISOString(),
            toDate: new Date(now).toISOString(),
            summary: {
                newTenants: events.tenantRegistrations.length,
                totalPayments: events.payments.length,
                totalAmount: events.payments.reduce((sum, payment) => 
                    sum + parseFloat(payment.amount), 0
                ).toFixed(4) + ' ETH'
            },
            tenantRegistrations: events.tenantRegistrations,
            payments: events.payments
        };

        return report;
    }

    async getBlockFromTimestamp(timestamp) {
        // Approximate block number from timestamp
        // This is a simplified implementation
        const currentBlock = await this.provider.getBlockNumber();
        const currentBlockInfo = await this.provider.getBlock(currentBlock);
        
        // Assume ~12 second block time for Ethereum
        const blockTime = 12;
        const timeDiff = currentBlockInfo.timestamp - timestamp;
        const blockDiff = Math.floor(timeDiff / blockTime);
        
        return Math.max(0, currentBlock - blockDiff);
    }
}

// Usage example
async function main() {
    const monitor = new RentPaymentMonitor(
        process.env.CONTRACT_ADDRESS,
        process.env.PROVIDER_URL,
        CONTRACT_ABI
    );

    // Set up event handlers
    monitor.on('tenantRegistered', (data) => {
        console.log('Application received tenant registration:', data);
    });

    monitor.on('rentPaid', (data) => {
        console.log('Application received rent payment:', data);
    });

    monitor.on('error', (error) => {
        console.error('Monitor error:', error);
    });

    // Start monitoring
    await monitor.startMonitoring();

    // Generate a report
    const report = await monitor.generateReport('30d');
    console.log('Monthly report:', JSON.stringify(report, null, 2));

    // Keep the process running
    process.on('SIGINT', () => {
        monitor.stopMonitoring();
        process.exit(0);
    });
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = RentPaymentMonitor;
```

## Testing Examples

### Unit Tests with Mocha/Chai

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentPaymentSystem", function () {
    let RentSystem;
    let rentSystem;
    let landlord;
    let tenant1;
    let tenant2;
    let addrs;

    beforeEach(async function () {
        // Get the ContractFactory and Signers
        RentSystem = await ethers.getContractFactory("RentPaymentSystem");
        [landlord, tenant1, tenant2, ...addrs] = await ethers.getSigners();

        // Deploy the contract
        rentSystem = await RentSystem.deploy();
        await rentSystem.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right landlord", async function () {
            expect(await rentSystem.landlord()).to.equal(landlord.address);
        });
    });

    describe("Tenant Registration", function () {
        it("Should register a tenant successfully", async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            
            await expect(rentSystem.registerTenant(tenant1.address, rentAmount))
                .to.emit(rentSystem, "TenantRegistered")
                .withArgs(tenant1.address, rentAmount);

            const tenantInfo = await rentSystem.tenants(tenant1.address);
            expect(tenantInfo.exists).to.be.true;
            expect(tenantInfo.rentAmount).to.equal(rentAmount);
            expect(tenantInfo.lastPaymentTimestamp).to.equal(0);
        });

        it("Should fail if non-landlord tries to register tenant", async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            
            await expect(
                rentSystem.connect(tenant1).registerTenant(tenant2.address, rentAmount)
            ).to.be.revertedWith("Only the landlord can perform this action");
        });

        it("Should fail if tenant is already registered", async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            
            await rentSystem.registerTenant(tenant1.address, rentAmount);
            
            await expect(
                rentSystem.registerTenant(tenant1.address, rentAmount)
            ).to.be.revertedWith("Tenant already registered");
        });
    });

    describe("Rent Payment", function () {
        beforeEach(async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            await rentSystem.registerTenant(tenant1.address, rentAmount);
        });

        it("Should allow tenant to pay rent", async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            
            await expect(
                rentSystem.connect(tenant1).payRent({ value: rentAmount })
            ).to.emit(rentSystem, "RentPaid")
            .withArgs(tenant1.address, rentAmount, await getLatestTimestamp());

            expect(await rentSystem.hasPaidRent(tenant1.address)).to.be.true;
        });

        it("Should fail if non-tenant tries to pay rent", async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            
            await expect(
                rentSystem.connect(tenant2).payRent({ value: rentAmount })
            ).to.be.revertedWith("Only registered tenants can perform this action");
        });

        it("Should fail if incorrect amount is sent", async function () {
            const wrongAmount = ethers.utils.parseEther("0.5");
            
            await expect(
                rentSystem.connect(tenant1).payRent({ value: wrongAmount })
            ).to.be.revertedWith("Incorrect rent amount");
        });

        it("Should transfer rent to landlord", async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            const landlordBalanceBefore = await landlord.getBalance();
            
            await rentSystem.connect(tenant1).payRent({ value: rentAmount });
            
            const landlordBalanceAfter = await landlord.getBalance();
            expect(landlordBalanceAfter.sub(landlordBalanceBefore)).to.equal(rentAmount);
        });
    });

    describe("View Functions", function () {
        beforeEach(async function () {
            const rentAmount = ethers.utils.parseEther("1.0");
            await rentSystem.registerTenant(tenant1.address, rentAmount);
            await rentSystem.connect(tenant1).payRent({ value: rentAmount });
        });

        it("Should return correct payment status", async function () {
            expect(await rentSystem.hasPaidRent(tenant1.address)).to.be.true;
            expect(await rentSystem.hasPaidRent(tenant2.address)).to.be.false;
        });

        it("Should return correct last payment timestamp", async function () {
            const timestamp = await rentSystem.getLastPaymentTimestamp(tenant1.address);
            expect(timestamp).to.be.gt(0);
        });

        it("Should fail to get timestamp for unregistered tenant", async function () {
            await expect(
                rentSystem.getLastPaymentTimestamp(tenant2.address)
            ).to.be.revertedWith("Tenant not registered");
        });
    });

    // Helper function to get latest block timestamp
    async function getLatestTimestamp() {
        const blockNumber = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNumber);
        return block.timestamp;
    }
});
```

This comprehensive documentation provides:

1. **Complete API documentation** with detailed function descriptions, parameters, and examples
2. **Multiple integration examples** for different environments (Node.js, Web, React, Backend API)
3. **Real-time event monitoring** with notification systems
4. **Testing examples** with proper test cases
5. **Deployment guides** with troubleshooting
6. **Usage examples** for all major use cases

The documentation covers everything needed for developers to successfully integrate and use the RentPaymentSystem smart contract in their applications.