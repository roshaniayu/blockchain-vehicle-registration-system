// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./UserIdentity.sol";
import "./VehicleRecord.sol";

contract InsuranceRecord {
    UserIdentity public userIdentitySC;
    VehicleRecord public vehicleRecordSC;

    struct InsuranceClaim {
        string insuranceRecordId; // PK
        string accidentId;        // FK
        uint256 createdDate;
        bool status;              // Active/Inactive claim
        string insuranceId;       // Policy number or ID
        bool approveClaim;
        string proofOfAccident;   // Image URL 
    }

    mapping(string => InsuranceClaim) public insuranceClaims;
    mapping(string => string[]) public claimsByAccidentId;
    mapping(string => string[]) public claimsByInsuranceId;

    event InsuranceClaimCreated(string indexed insuranceRecordId, string accidentId);
    event InsuranceClaimApproved(string indexed insuranceRecordId, address approver);
    event InsurancePolicyUpdated(string indexed vehicleId, string insuranceId);

    modifier onlyInsurance() {
        require(userIdentitySC.verifyIsInsurance(msg.sender), "Caller is not Insurance");
        _;
    }

    constructor(address _userIdentityAddress, address _vehicleRecordAddress) {
        userIdentitySC = UserIdentity(_userIdentityAddress);
        vehicleRecordSC = VehicleRecord(_vehicleRecordAddress);
    }

    /// @notice Create a new insurance claim linked to an accident
    function createInsuranceClaim(
        string memory _insuranceRecordId,
        string memory _accidentId,
        string memory _insuranceId,
        string memory _proofOfAccident
    ) public onlyInsurance {
        require(bytes(insuranceClaims[_insuranceRecordId].insuranceRecordId).length == 0, "Claim already exists");

        InsuranceClaim memory newClaim = InsuranceClaim({
            insuranceRecordId: _insuranceRecordId,
            accidentId: _accidentId,
            createdDate: block.timestamp,
            status: true,
            insuranceId: _insuranceId,
            approveClaim: false,
            proofOfAccident: _proofOfAccident
        });

        insuranceClaims[_insuranceRecordId] = newClaim;
        claimsByAccidentId[_accidentId].push(_insuranceRecordId);
        claimsByInsuranceId[_insuranceId].push(_insuranceRecordId);

        emit InsuranceClaimCreated(_insuranceRecordId, _accidentId);
    }

    /// @notice Approve a claim and update vehicle insurance linkage
    function approveInsuranceClaim(string memory _insuranceRecordId, string memory _vehicleId)
        public
        onlyInsurance
    {
        InsuranceClaim storage claim = insuranceClaims[_insuranceRecordId];
        require(!claim.approveClaim, "Claim already approved");
        claim.approveClaim = true;

        // Update the vehicle's insuranceId in VehicleRecord
        try vehicleRecordSC.modifyInsuranceId(_vehicleId, claim.insuranceId) {
            emit InsurancePolicyUpdated(_vehicleId, claim.insuranceId);
        } catch {
            // ignore if VehicleRecord restricts modification to LTA
        }

        emit InsuranceClaimApproved(_insuranceRecordId, msg.sender);
    }

    /// @notice Fetch all claims for a given accident
    function getClaimsByAccidentId(string memory _accidentId) public view returns (string[] memory) {
        return claimsByAccidentId[_accidentId];
    }

    /// @notice Fetch all claims for a given insurance policy
    function getClaimsByInsuranceId(string memory _insuranceId) public view returns (string[] memory) {
        return claimsByInsuranceId[_insuranceId];
    }
}
