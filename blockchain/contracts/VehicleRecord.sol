// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./UserIdentity.sol";

contract VehicleRecord {
    UserIdentity public userIdentitySC;

    struct Vehicle {
        string vehicleId;                   // Unique vehicle identifier
        string currentOwnerId;              // Owner ID reference
        address payable currentOwnerAddress;// Owner wallet address
        string insuranceId;                 // Linked insurance record
        uint256 coeStartDate;               // COE start date (timestamp)
        uint256 coeExpiryDate;              // COE expiry date (timestamp)
        uint256 manufactureDate;            // Manufacturing year/date
        string manufactureCompany;          // Company name
        string modelNo;                    // Model number
        bool vehicleSignature;              // LTA verification flag
        string[] accidentIds;             // Linked traffic/accident IDs
        string[] claimIds;                // 🔹 new
        uint256 totalFinesPaid;           // 🔹 new
        uint256 totalClaimsReceived; 
    }

    mapping(string => Vehicle) public vehicles; // vehicleId → Vehicle mapping

    modifier onlyLTA() {
        require(userIdentitySC.verifyIsLTA(msg.sender), "Caller is not LTA");
        _;
    }

    constructor(address _userIdentityAddress) {
        userIdentitySC = UserIdentity(_userIdentityAddress);
    }

    /**
     * @dev Register a new vehicle by the LTA.
     */
    function addVehicle(
        string memory _vehicleId,
        string memory _ownerId,
        address payable _ownerAddress,
        uint256 _coeStartDate,
        uint256 _coeExpiryDate,
        uint256 _manufactureDate,
        string memory _company,
        string memory _modelNo
    ) public onlyLTA {
        require(bytes(vehicles[_vehicleId].vehicleId).length == 0, "Vehicle already exists");
        require(_coeExpiryDate > _coeStartDate, "Invalid COE duration");

        vehicles[_vehicleId] = Vehicle({
            vehicleId: _vehicleId,
            currentOwnerId: _ownerId,
            currentOwnerAddress: _ownerAddress,
            insuranceId: "",
            coeStartDate: _coeStartDate,
            coeExpiryDate: _coeExpiryDate,
            manufactureDate: _manufactureDate,
            manufactureCompany: _company,
            modelNo: _modelNo,
            vehicleSignature: true,
            accidentIds: new string[](0) ,
            claimIds: new string[](0) ,
            totalFinesPaid: 0,
            totalClaimsReceived: 0
        });
    }

    /**
     * @dev Transfer ownership (used by OwnershipRecord contract).
     */
    function updateOwner(
        string memory _vehicleId,
        string memory _newOwnerId,
        address payable _newOwnerAddr
    ) external {
        require(bytes(vehicles[_vehicleId].vehicleId).length != 0, "Vehicle not found");
        vehicles[_vehicleId].currentOwnerId = _newOwnerId;
        vehicles[_vehicleId].currentOwnerAddress = _newOwnerAddr;
    }

    function updateFinePayment(string memory _vehicleId, uint256 _amount) external {
        require(bytes(vehicles[_vehicleId].vehicleId).length != 0, "Vehicle not found");
        vehicles[_vehicleId].totalFinesPaid += _amount;
    }

    // called by InsuranceRecord when a claim is settled
    function updateClaimSettlement(
        string memory _vehicleId,
        uint256 _amount
    ) external {
        require(bytes(vehicles[_vehicleId].vehicleId).length != 0, "Vehicle not found");
        vehicles[_vehicleId].totalClaimsReceived += _amount;
    }

    /**
     * @dev Link accident or violation record.
     */
    function linkAccident(string memory _vehicleId, string memory _accidentId) external {
        require(bytes(vehicles[_vehicleId].vehicleId).length != 0, "Vehicle not found");
        vehicles[_vehicleId].accidentIds.push(_accidentId);
    }

    /**
     * @dev Link claim record.
     */
    function linkClaim(string memory _vehicleId, string memory _claimId) external {
        require(bytes(vehicles[_vehicleId].vehicleId).length != 0, "Vehicle not found");
        vehicles[_vehicleId].claimIds.push(_claimId);
    }


    /**
     * @dev Link insurance record with vehicle.
     */
    function updateInsurance(string memory _vehicleId, string memory _insuranceId) external {
        require(bytes(vehicles[_vehicleId].vehicleId).length != 0, "Vehicle not found");
        vehicles[_vehicleId].insuranceId = _insuranceId;
    }

    /**
     * @dev Verify if COE is still valid.
     */
    function isCOEActive(string memory _vehicleId) public view returns (bool) {
        Vehicle memory v = vehicles[_vehicleId];
        return (block.timestamp >= v.coeStartDate && block.timestamp <= v.coeExpiryDate);
    }

    /**
     * @dev Fetch vehicle info by ID.
     */
    function getTotalFinesPaid(string memory _vehicleId) public view returns (uint256) {
        return vehicles[_vehicleId].totalFinesPaid;
    }

    function getTotalClaimsReceived(string memory _vehicleId) public view returns (uint256) {
        return vehicles[_vehicleId].totalClaimsReceived;
    }

    function getClaimIds(string memory _vehicleId) public view returns (string[] memory) {
        return vehicles[_vehicleId].claimIds;
    }

    function getVehicle(string memory _vehicleId) public view returns (Vehicle memory) {
        require(bytes(vehicles[_vehicleId].vehicleId).length != 0, "Vehicle not found");
        return vehicles[_vehicleId];
    }

    function isVehicleExist(string memory vehicleId) public view returns (bool) {
    // Check if the vehicle record exists by verifying non-empty fields or registration status
    return bytes(vehicles[vehicleId].vehicleId).length > 0;
    }

}
