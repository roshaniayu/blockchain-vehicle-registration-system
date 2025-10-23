// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserIdentity.sol";

contract VehicleRecord {
    UserIdentity public userIdentitySC;

    struct Vehicle {
        string vehicleId; // PK
        string[] accidentIds; // FK
        string insuranceId; // FK
        uint256 coeDate;
        uint256 manufactureDate;
        string manufactureCompany;
        uint256 modelNo;
        bool vehicleSignature; // LTA's signature
    }

    // --- State Variables ---
    mapping(string => Vehicle) public vehicles;

    // --- Modifiers ---
    // Modifier to restrict functions to LTA members
    modifier onlyLTA() {
        require(userIdentitySC.verifyIsLTA(msg.sender), "Caller is not LTA");
        _;
    }

    // --- Constructor ---
    constructor(address _userIdentityAddress) {
        userIdentitySC = UserIdentity(_userIdentityAddress);
    }

    /**
     * @dev Adds a new vehicle. Only callable by LTA.
     */
    function addVehicle(Vehicle memory _vehicle) public onlyLTA {
        require(
            bytes(vehicles[_vehicle.vehicleId].vehicleId).length == 0,
            "Vehicle already exists"
        );
        vehicles[_vehicle.vehicleId] = _vehicle;
    }

    /**
     * @dev Gets all details for a specific vehicle.
     */
    function getVehicleDetail(string memory _vehicleId) public view returns (Vehicle memory) {
        return vehicles[_vehicleId];
    }

    /**
     * @dev Gets the COE status (expiry date) for a specific vehicle.
     */
    function getCOEStatus(string memory _vehicleId) public view returns (uint256) {
        return vehicles[_vehicleId].coeDate;
    }

    /**
     * @dev Modifies the COE expiry date. Only callable by LTA.
     */
    function modifyCOEDate(string memory _vehicleId, uint256 _date) public onlyLTA {
        vehicles[_vehicleId].coeDate = _date;
    }

    /**
     * @dev ModGifies the insurance policy number. Only callable by LTA.
     */
    function modifyInsuranceId(string memory _vehicleId, string memory _insuranceId) public onlyLTA {
        vehicles[_vehicleId].insuranceId = _insuranceId;
    }

    /**
     * @dev LTA officially signs off on a vehicle's details. Only callable by LTA.
     */
    function signVehicleByLTA(string memory _vehicleId) public onlyLTA {
        vehicles[_vehicleId].vehicleSignature = true;
    }

    /**
     * @dev Verifies if a vehicle has been signed by the LTA.
     */
    function verifyVehicle(string memory _vehicleId) public view returns (bool) {
        return vehicles[_vehicleId].vehicleSignature;
    }

    /**
     * @dev Links a new accident record. Only callable by LTA.
     */
    function linkAccidentRecord(string memory _vehicleId, string memory _accidentId) public onlyLTA {
        vehicles[_vehicleId].accidentIds.push(_accidentId);
    }
}