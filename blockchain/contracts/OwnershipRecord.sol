// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserIdentity.sol";

contract OwnershipRecord {
    UserIdentity public userIdentitySC;

    enum EscrowState { Inactive, AwaitingPayment, AwaitingDelivery }
 
    struct Ownership {
        string ownershipId; // PK
        string vehicleId; // FK
        string vehicleOwnerId; // FK
        address payable owner;
        uint256 ownershipStartDate;
        uint256 ownershipEndDate;
        uint256 amount;
        bool ownershipSignature;
    }

    struct Escrow {
        address payable seller;
        address payable buyer;
        uint256 price;
        EscrowState state;
    }

    // --- State Variables ---
    mapping(string => Ownership) public ownerships;
    mapping(string => string[]) public ownershipsByVehicleId;
    mapping(string => string[]) public ownershipsByVehicleOwnerId;

    // Tracks the CURRENT active ownership record for a vehicle
    mapping(string => string) public activeOwnershipOfVehicle;

    // Tracks the active escrow for a vehicle
    mapping(string => Escrow) public escrows;

    // --- Events ---
    event EscrowInitiated(string indexed vehicleId, address indexed seller, address indexed buyer, uint256 price);
    event FundsDeposited(string indexed vehicleId, address indexed buyer, uint256 amount);
    event TransferConfirmed(string indexed vehicleId, address indexed from, address indexed to, string newOwnershipId);
    event EscrowCanceled(string indexed vehicleId);

    // --- Modifiers ---
    // Modifier to restrict functions to LTA members
    modifier onlyLTA() {
        require(userIdentitySC.verifyIsLTA(msg.sender), "Caller is not LTA");
        _;
    }

    modifier onlyActiveVehicleOwner(string memory _vehicleId) {
        string memory activeId = activeOwnershipOfVehicle[_vehicleId];
        require(bytes(activeId).length > 0, "Vehicle has no active owner");
        require(ownerships[activeId].owner == msg.sender, "You are not the current owner");
        _;
    }

    // --- Constructor ---
    constructor(address _userIdentityAddress) {
        userIdentitySC = UserIdentity(_userIdentityAddress);
    }

    /**
     * @dev Adds the FIRST ownership record for a new vehicle.
     * Only callable by LTA.
     */
    function addFirstOwnership(Ownership memory _ownership) public onlyLTA {
        require(bytes(ownerships[_ownership.ownershipId].ownershipId).length == 0, "Ownership ID exists");
        require(bytes(activeOwnershipOfVehicle[_ownership.vehicleId]).length == 0, "Vehicle has owner");
        require(userIdentitySC.verifyIsVehicleOwner(_ownership.owner), "Not a valid owner");

        _ownership.ownershipEndDate = 0; // 0 signifies active
        ownerships[_ownership.ownershipId] = _ownership;
        ownershipsByVehicleId[_ownership.vehicleId].push(_ownership.ownershipId);
        ownershipsByVehicleOwnerId[_ownership.vehicleOwnerId].push(_ownership.ownershipId);
        activeOwnershipOfVehicle[_ownership.vehicleId] = _ownership.ownershipId;
    }

    /**
     * @dev Gets all ownership record IDs (history) for a specific vehicle.
     */
    function getOwnershipByVehicleId(string memory _vehicleId) public view returns (string[] memory) {
        return ownershipsByVehicleId[_vehicleId];
    }

    /**
     * @dev Gets all ownership record IDs for a specific owner.
     */
    function getOwnershipByVehicleOwnerId(string memory _vehicleOwnerId) public view returns (string[] memory) {
        return ownershipsByVehicleOwnerId[_vehicleOwnerId];
    }

    /**
     * @dev Allows the owner of a *specific record* to sign it
     * (e.g., the new buyer signing to accept their new title).
     */
    function signOwnership(string memory _ownershipId) public {
        Ownership storage record = ownerships[_ownershipId];
        require(record.owner == msg.sender, "Not the owner of this record");
        record.ownershipSignature = true;
    }

    // --- ESCROW FUNCTIONS ---

    /**
     * @dev Step 1 (Seller): Initiates the escrow by setting the buyer and price.
     */
    function initiateEscrow(string memory _vehicleId, address payable _buyer, uint256 _price)
        public
        onlyActiveVehicleOwner(_vehicleId)
    {
        require(escrows[_vehicleId].state == EscrowState.Inactive, "Escrow already active");
        require(userIdentitySC.verifyIsVehicleOwner(_buyer), "Buyer is not a registered owner");
        
        escrows[_vehicleId] = Escrow({
            seller: payable(msg.sender),
            buyer: _buyer,
            price: _price,
            state: EscrowState.AwaitingPayment
        });

        emit EscrowInitiated(_vehicleId, msg.sender, _buyer, _price);
    }

    /**
     * @dev Step 2 (Buyer): Deposits the funds into the contract's escrow.
     */
    function depositIntoEscrow(string memory _vehicleId) public payable {
        Escrow storage e = escrows[_vehicleId];
        require(e.state == EscrowState.AwaitingPayment, "Not awaiting payment");
        require(msg.sender == e.buyer, "You are not the buyer");
        require(msg.value == e.price, "Incorrect payment amount");

        e.state = EscrowState.AwaitingDelivery;
        emit FundsDeposited(_vehicleId, msg.sender, msg.value);
    }

    /**
     * @dev Step 3 (Buyer): Confirms they have received the car.
     * This action is final and releases the funds to the seller
     * and transfers the ownership record to the buyer.
     */
    function confirmDelivery(
        string memory _vehicleId,
        string memory _newOwnershipId,
        string memory _newOwnerId
    ) public {
        Escrow storage e = escrows[_vehicleId];
        require(e.state == EscrowState.AwaitingDelivery, "Not awaiting delivery confirmation");
        require(msg.sender == e.buyer, "Only the buyer can confirm delivery");
        require(bytes(_newOwnershipId).length > 0, "New Ownership ID is empty");
        require(bytes(ownerships[_newOwnershipId].ownershipId).length == 0, "New ID exists");

        // --- 1. Get old record and seller ---
        string memory oldOwnershipId = activeOwnershipOfVehicle[_vehicleId];
        Ownership storage oldOwnership = ownerships[oldOwnershipId];
        address payable seller = e.seller;

        // --- 2. Update old record (end date) ---
        oldOwnership.ownershipEndDate = block.timestamp;

        // --- 3. Create new record for buyer ---
        Ownership memory newOwnership = Ownership({
            ownershipId: _newOwnershipId,
            vehicleId: _vehicleId,
            vehicleOwnerId: _newOwnerId,
            owner: payable(msg.sender),
            ownershipStartDate: block.timestamp,
            ownershipEndDate: 0, // 0 = active
            amount: e.price,
            ownershipSignature: false // Buyer should sign this
        });
        ownerships[_newOwnershipId] = newOwnership;

        // --- 4. Update state ---
        ownershipsByVehicleId[_vehicleId].push(_newOwnershipId);
        ownershipsByVehicleOwnerId[_newOwnerId].push(_newOwnershipId);
        activeOwnershipOfVehicle[_vehicleId] = _newOwnershipId;

        // --- 5. Pay Seller ---
        (bool success, ) = seller.call{value: e.price}("");
        require(success, "Payment to seller failed");

        // --- 6. Clean up escrow ---
        delete escrows[_vehicleId];

        emit TransferConfirmed(_vehicleId, seller, msg.sender, _newOwnershipId);
    }

    /**
     * @dev Allows either party to cancel the escrow *before* funds are deposited.
     */
    function cancelEscrow(string memory _vehicleId) public {
        Escrow storage e = escrows[_vehicleId];
        require(e.state == EscrowState.AwaitingPayment, "Cannot cancel once payment is deposited");
        require(msg.sender == e.seller || msg.sender == e.buyer, "Not part of this escrow");

        delete escrows[_vehicleId];
        emit EscrowCanceled(_vehicleId);
    }
}