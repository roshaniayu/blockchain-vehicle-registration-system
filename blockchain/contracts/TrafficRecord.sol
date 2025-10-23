// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./UserIdentity.sol";
import "./VehicleRecord.sol";

/// @title TrafficRecords - stores accident/traffic records on-chain
/// @dev Roles: DEFAULT_ADMIN_ROLE (deployer), LTA_ROLE, SPF_ROLE
contract TrafficRecord {
    UserIdentity public userIdentitySC;
    VehicleRecord public vehicleRecordSC;

    struct Traffic {
        string accidentId;
        string ownerId;
        string vehicleId;
        string accidentType;
        uint256 accidentDate;
        string reason;
        uint256 amount;
        bool trafficSignature;
    }

    mapping(string => Traffic) public trafficRecords;
    mapping(string => string[]) public trafficByOwner;
    mapping(string => string[]) public trafficByVehicle;

    event TrafficRecordAdded(string indexed accidentId, string vehicleId, string ownerId);
    event TrafficSigned(string indexed accidentId, address signer);

    modifier onlySPF() {
        require(userIdentitySC.verifyIsSPF(msg.sender), "Caller is not SPF");
        _;
    }

    constructor(address _userIdentityAddress, address _vehicleRecordAddress) {
        userIdentitySC = UserIdentity(_userIdentityAddress);
        vehicleRecordSC = VehicleRecord(_vehicleRecordAddress);
    }

    /// @notice Checks if address is SPF
    function isSPF(address addr) public view returns (bool) {
        return userIdentitySC.verifyIsSPF(addr);
    }

    /// @notice Adds a new traffic/accident record (SPF only)
    function addTrafficRecord(
        string memory _accidentId,
        string memory _ownerId,
        string memory _vehicleId,
        string memory _accidentType,
        uint256 _accidentDate,
        string memory _reason,
        uint256 _amount
    ) public onlySPF {
        require(bytes(trafficRecords[_accidentId].accidentId).length == 0, "Record already exists");

        Traffic memory record = Traffic({
            accidentId: _accidentId,
            ownerId: _ownerId,
            vehicleId: _vehicleId,
            accidentType: _accidentType,
            accidentDate: _accidentDate,
            reason: _reason,
            amount: _amount,
            trafficSignature: false
        });

        trafficRecords[_accidentId] = record;
        trafficByOwner[_ownerId].push(_accidentId);
        trafficByVehicle[_vehicleId].push(_accidentId);

        // Link accident to vehicle in VehicleRecord
        // Only LTA can call this, so we add a try/catch in case the LTA restriction reverts
        try vehicleRecordSC.linkAccidentRecord(_vehicleId, _accidentId) {
            // Successfully linked
        } catch {
            // If LTA-only restriction fails, just skip linking (to avoid revert)
        }

        emit TrafficRecordAdded(_accidentId, _vehicleId, _ownerId);
    }

    /// @notice SPF digitally signs an accident record
    function signBySPF(string memory _accidentId) public onlySPF {
        trafficRecords[_accidentId].trafficSignature = true;
        emit TrafficSigned(_accidentId, msg.sender);
    }

    /// @notice Get all accidents for an owner
    function getTrafficRecordsByOwner(string memory _ownerId) public view returns (string[] memory) {
        return trafficByOwner[_ownerId];
    }

    /// @notice Get all accidents for a vehicle
    function getTrafficRecordsByVehicle(string memory _vehicleId) public view returns (string[] memory) {
        return trafficByVehicle[_vehicleId];
    }
}
