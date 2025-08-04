# RentPaymentSystem API Reference

This document provides detailed technical documentation for the RentPaymentSystem smart contract.

## Contract Overview

- **Contract Name**: RentPaymentSystem
- **Solidity Version**: >=0.7.3
- **License**: Not specified

## State Variables

### `landlord`
```solidity
address public landlord
```
**Type**: `address`  
**Visibility**: `public`  
**Description**: The Ethereum address of the landlord who deployed the contract. This address has special privileges to register tenants.

### `tenants`
```solidity
mapping(address => Tenant) public tenants
```
**Type**: `mapping(address => Tenant)`  
**Visibility**: `public`  
**Description**: A mapping that stores tenant information indexed by their Ethereum address. Automatically generates a getter function.

## Data Structures

### `Tenant`
```solidity
struct Tenant {
    uint256 rentAmount;
    uint256 lastPaymentTimestamp;
    bool exists;
}
```

**Fields**:
- `rentAmount` (`uint256`): The monthly rent amount in wei that this tenant must pay
- `lastPaymentTimestamp` (`uint256`): Unix timestamp of the tenant's last rent payment (0 if never paid)
- `exists` (`bool`): Flag indicating whether the tenant is registered in the system

## Modifiers

### `onlyLandlord()`
```solidity
modifier onlyLandlord() {
    require(msg.sender == landlord, "Only the landlord can perform this action");
    _;
}
```
**Description**: Restricts function access to the landlord only.  
**Revert Condition**: Reverts if `msg.sender` is not the landlord address.

### `onlyTenant()`
```solidity
modifier onlyTenant() {
    require(tenants[msg.sender].exists, "Only registered tenants can perform this action");
    _;
}
```
**Description**: Restricts function access to registered tenants only.  
**Revert Condition**: Reverts if the caller is not a registered tenant.

## Constructor

### `constructor()`
```solidity
constructor() {
    landlord = msg.sender;
}
```
**Description**: Initializes the contract by setting the deployer as the landlord.  
**Parameters**: None  
**Effects**: Sets `landlord` to `msg.sender`

## Functions

### `registerTenant(address _tenant, uint256 _rentAmount)`

Registers a new tenant with a specified monthly rent amount.

**Function Signature**:
```solidity
function registerTenant(address _tenant, uint256 _rentAmount) public onlyLandlord
```

**Access Control**: `onlyLandlord`  
**State Mutability**: Non-payable

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `_tenant` | `address` | The Ethereum address of the tenant to register |
| `_rentAmount` | `uint256` | The monthly rent amount in wei |

**Requirements**:
- Caller must be the landlord (`onlyLandlord` modifier)
- Tenant must not already be registered (`!tenants[_tenant].exists`)

**Effects**:
- Creates a new `Tenant` struct with the provided rent amount
- Sets `exists` to `true` for the tenant
- Initializes `lastPaymentTimestamp` to `0`

**Events Emitted**:
- `TenantRegistered(_tenant, _rentAmount)`

**Gas Considerations**: Moderate gas cost due to storage writes

**Example Usage**:
```javascript
// Register a tenant with 1 ETH monthly rent
const rentAmount = ethers.utils.parseEther("1.0");
await contract.registerTenant("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE", rentAmount);
```

### `payRent()`

Allows registered tenants to pay their monthly rent.

**Function Signature**:
```solidity
function payRent() public payable onlyTenant
```

**Access Control**: `onlyTenant`  
**State Mutability**: Payable

**Parameters**: None (amount sent via `msg.value`)

**Requirements**:
- Caller must be a registered tenant (`onlyTenant` modifier)
- `msg.value` must equal the tenant's registered rent amount

**Effects**:
- Updates the tenant's `lastPaymentTimestamp` to current block timestamp
- Transfers the entire payment amount to the landlord
- Emits `RentPaid` event

**Events Emitted**:
- `RentPaid(msg.sender, msg.value, block.timestamp)`

**Gas Considerations**: Moderate gas cost due to storage write and external transfer

**Security Notes**:
- Uses `transfer()` which limits gas to 2300, preventing reentrancy attacks
- Validates exact payment amount to prevent overpayment or underpayment

**Example Usage**:
```javascript
// Tenant pays their rent (assuming 1 ETH rent amount)
const rentAmount = ethers.utils.parseEther("1.0");
await contract.connect(tenantSigner).payRent({ value: rentAmount });
```

### `hasPaidRent(address _tenant)`

Checks whether a tenant has ever made a rent payment.

**Function Signature**:
```solidity
function hasPaidRent(address _tenant) public view returns (bool)
```

**Access Control**: Public  
**State Mutability**: View (read-only)

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `_tenant` | `address` | The address of the tenant to check |

**Returns**:
| Type | Description |
|------|-------------|
| `bool` | `true` if the tenant has made at least one payment, `false` otherwise |

**Logic**: Returns `true` if `tenants[_tenant].lastPaymentTimestamp > 0`

**Gas Considerations**: Very low gas cost (view function)

**Example Usage**:
```javascript
const hasPaid = await contract.hasPaidRent("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE");
if (hasPaid) {
    console.log("Tenant has made at least one payment");
} else {
    console.log("Tenant has never paid rent");
}
```

### `getLastPaymentTimestamp(address _tenant)`

Retrieves the timestamp of a tenant's most recent rent payment.

**Function Signature**:
```solidity
function getLastPaymentTimestamp(address _tenant) public view returns (uint256)
```

**Access Control**: Public  
**State Mutability**: View (read-only)

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `_tenant` | `address` | The address of the tenant |

**Returns**:
| Type | Description |
|------|-------------|
| `uint256` | Unix timestamp of the last payment (0 if never paid) |

**Requirements**:
- Tenant must be registered (`tenants[_tenant].exists`)

**Gas Considerations**: Very low gas cost (view function)

**Example Usage**:
```javascript
try {
    const timestamp = await contract.getLastPaymentTimestamp("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE");
    if (timestamp > 0) {
        const paymentDate = new Date(timestamp * 1000);
        console.log("Last payment made on:", paymentDate.toISOString());
    } else {
        console.log("No payments made yet");
    }
} catch (error) {
    console.log("Tenant not registered");
}
```

## Events

### `TenantRegistered`

Emitted when a new tenant is successfully registered.

**Event Signature**:
```solidity
event TenantRegistered(address indexed tenant, uint256 rentAmount)
```

**Parameters**:
| Name | Type | Indexed | Description |
|------|------|---------|-------------|
| `tenant` | `address` | Yes | The address of the registered tenant |
| `rentAmount` | `uint256` | No | The monthly rent amount in wei |

**When Emitted**: During successful execution of `registerTenant()`

**Filtering Examples**:
```javascript
// Listen for all tenant registrations
contract.on("TenantRegistered", (tenant, rentAmount, event) => {
    console.log(`New tenant registered: ${tenant}`);
    console.log(`Rent amount: ${ethers.utils.formatEther(rentAmount)} ETH`);
});

// Filter for specific tenant registration
const filter = contract.filters.TenantRegistered("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE");
const events = await contract.queryFilter(filter);
```

### `RentPaid`

Emitted when a tenant successfully pays their rent.

**Event Signature**:
```solidity
event RentPaid(address indexed tenant, uint256 amount, uint256 timestamp)
```

**Parameters**:
| Name | Type | Indexed | Description |
|------|------|---------|-------------|
| `tenant` | `address` | Yes | The address of the tenant who paid |
| `amount` | `uint256` | No | The amount paid in wei |
| `timestamp` | `uint256` | No | The timestamp when payment was made |

**When Emitted**: During successful execution of `payRent()`

**Filtering Examples**:
```javascript
// Listen for all rent payments
contract.on("RentPaid", (tenant, amount, timestamp, event) => {
    console.log(`Rent paid by: ${tenant}`);
    console.log(`Amount: ${ethers.utils.formatEther(amount)} ETH`);
    console.log(`Time: ${new Date(timestamp * 1000).toISOString()}`);
});

// Filter for payments by specific tenant
const filter = contract.filters.RentPaid("0x742d35Cc6634C0532925a3b8D72C8c0DE4649BfE");
const events = await contract.queryFilter(filter);

// Get payment history for all tenants
const allPayments = await contract.queryFilter(contract.filters.RentPaid());
```

## Error Handling

### Common Revert Reasons

| Error Message | Function | Cause |
|---------------|----------|-------|
| "Only the landlord can perform this action" | `registerTenant()` | Non-landlord trying to register tenant |
| "Tenant already registered" | `registerTenant()` | Attempting to register existing tenant |
| "Only registered tenants can perform this action" | `payRent()` | Unregistered address trying to pay rent |
| "Incorrect rent amount" | `payRent()` | Payment amount doesn't match registered rent |
| "Tenant not registered" | `getLastPaymentTimestamp()` | Querying unregistered tenant |

### Error Handling Examples

```javascript
// Handle registration errors
try {
    await contract.registerTenant(tenantAddress, rentAmount);
} catch (error) {
    if (error.message.includes("Tenant already registered")) {
        console.log("This tenant is already registered");
    } else if (error.message.includes("Only the landlord")) {
        console.log("Only the landlord can register tenants");
    }
}

// Handle payment errors
try {
    await contract.connect(tenant).payRent({ value: rentAmount });
} catch (error) {
    if (error.message.includes("Incorrect rent amount")) {
        console.log("Payment amount doesn't match required rent");
    } else if (error.message.includes("Only registered tenants")) {
        console.log("Tenant must be registered first");
    }
}
```

## Gas Estimates

| Function | Estimated Gas | Notes |
|----------|---------------|-------|
| `registerTenant()` | ~50,000 | First-time storage allocation |
| `payRent()` | ~35,000 | Storage update + transfer |
| `hasPaidRent()` | ~500 | View function |
| `getLastPaymentTimestamp()` | ~800 | View function with validation |

*Note: Gas estimates are approximate and may vary based on network conditions and contract state.*

## Integration Patterns

### Complete Workflow Example

```javascript
// 1. Deploy contract (landlord becomes owner)
const RentSystem = await ethers.getContractFactory("RentPaymentSystem");
const contract = await RentSystem.deploy();

// 2. Register tenants
await contract.registerTenant(tenant1Address, ethers.utils.parseEther("1.0"));
await contract.registerTenant(tenant2Address, ethers.utils.parseEther("0.5"));

// 3. Tenants pay rent
await contract.connect(tenant1).payRent({ value: ethers.utils.parseEther("1.0") });
await contract.connect(tenant2).payRent({ value: ethers.utils.parseEther("0.5") });

// 4. Check payment status
const tenant1Paid = await contract.hasPaidRent(tenant1Address);
const tenant1LastPayment = await contract.getLastPaymentTimestamp(tenant1Address);
```

### Event-Driven Architecture

```javascript
// Set up event listeners for real-time updates
contract.on("TenantRegistered", (tenant, rentAmount) => {
    // Update UI or database
    updateTenantList(tenant, rentAmount);
});

contract.on("RentPaid", (tenant, amount, timestamp) => {
    // Update payment records
    recordPayment(tenant, amount, timestamp);
    // Send confirmation
    sendPaymentConfirmation(tenant);
});
```

## Security Considerations

### Access Control
- Functions are properly protected with modifiers
- Only landlord can register tenants
- Only registered tenants can pay rent

### Reentrancy Protection
- Uses `transfer()` instead of `call()` for ETH transfers
- Transfer happens after state changes (checks-effects-interactions pattern)

### Input Validation
- All functions validate inputs and requirements
- Prevents duplicate tenant registration
- Ensures exact payment amounts

### Integer Overflow/Underflow
- Solidity 0.7.3 has built-in overflow protection
- All arithmetic operations are safe

## Upgradeability

This contract is **not upgradeable**. Once deployed, the code cannot be changed. Consider this when:
- Planning long-term usage
- Implementing bug fixes
- Adding new features

For upgradeable contracts, consider using OpenZeppelin's proxy patterns in future versions.