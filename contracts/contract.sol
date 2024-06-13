pragma solidity >=0.7.3;

contract RentPaymentSystem{
    // Emitted when a tenant pays the rent
    event RentPaid(address indexed tenant, uint256 amound, uint256 timestamp);

    // Emitted when a new tenant is registered
    event TenantRegistered(address indexed tenant, uint256 rentAmound);

    // Structure to store tenant information
    struct Tenant{
        uint256 rentAmount;
        uint256 lastPaymentTimestamp;
        bool exists;
    }

// Mapping from tenant address to their information
mapping(address => Tenant) public tenants;

//address of the landlord
address public landlord;

//modifier to restrict actions to the landlord
modifier onlyLandlord(){
    require(msg.sender == landlord, "Only the landlord can perform this action");
    _;
}

// Modifier to check if the sender is a registered tenant
modifier onlyTenant(){
    require(tenants[msg.sender].exists, "Only registered tenants can perform this action");
    _;
}

//Constructor to set the landlord
constructor(){
    landlord = msg.sender;

}

// Function to register a new tenant
function registerTenant(address _tenant, uint256 _rentAmount) public onlyLandlord {
    require(!tenants[_tenant].exists, "Tenant already registered");
    tenants[_tenant] = Tenant(_rentAmount, 0, true);
    emit TenantRegistered(_tenant, _rentAmount);
}

//Function for tenants to pay rent
function payRent() public payable onlyTenant {
    Tenant storage tenant = tenants[msg.sender];
    require(msg.value == tenant.rentAmount, "Incorrect rent amount");

    tenant.lastPaymentTimestamp = block.timestamp;
    emit RentPaid(msg.sender, msg.value, block.timestamp);

    //Transfer the rent amount to the landlord
    payable(landlord).transfer(msg.value);
}
function hasPaidRent(address _tenant) public view returns (bool){
    return tenants[_tenant].lastPaymentTimestamp > 0;
}

function getLastPaymentTimestamp(address _tenant) public view returns (uint256){
    require(tenants[_tenant].exists, "Tenant not registered");
    return tenants[_tenant].lastPaymentTimestamp;   
}
}