// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./VehicleRecord.sol";
import "./UserIdentity.sol";

contract InsuranceRecord {
    UserIdentity public userIdentitySC;
    VehicleRecord public vehicleRecordSC;

    struct Insurance {
        string insuranceId;
        string vehicleId;
        string insurerId;
        address payable insurerAddress;
        string policyType;
        uint256 premiumAmount;
        uint256 coverageLimit; // Maximum payable coverage
        uint256 policyStartDate;
        uint256 policyExpiryDate;
        bool isActive;
    }

    struct Claim {
        string claimId;
        string insuranceId;
        string vehicleId;
        string ownerId;
        string reason;
        uint256 claimedAmount;
        uint256 approvedAmount;
        bool isApproved;
        bool isSettled;
    }

    mapping(string => Insurance) public insurances;
    mapping(string => Claim) public claims;

    modifier onlyInsurer() {
        require(userIdentitySC.verifyIsInsurance(msg.sender), "Caller is not an insurer");
        _;
    }

    constructor(address _userIdentityAddr, address _vehicleRecordAddr) {
        userIdentitySC = UserIdentity(_userIdentityAddr);
        vehicleRecordSC = VehicleRecord(_vehicleRecordAddr);
    }

    /**
     * @dev Register a new insurance policy
     */
    function addInsurance(
        string memory _insuranceId,
        string memory _vehicleId,
        string memory _insurerId,
        address payable _insurerAddress,
        string memory _policyType,
        uint256 _premiumAmount,
        uint256 _coverageLimit,
        uint256 _startDate,
        uint256 _expiryDate
    ) public onlyInsurer {
        require(bytes(insurances[_insuranceId].insuranceId).length == 0, "Insurance ID exists");
        require(_expiryDate > _startDate, "Invalid policy dates");

        insurances[_insuranceId] = Insurance({
            insuranceId: _insuranceId,
            vehicleId: _vehicleId,
            insurerId: _insurerId,
            insurerAddress: _insurerAddress,
            policyType: _policyType,
            premiumAmount: _premiumAmount,
            coverageLimit: _coverageLimit,
            policyStartDate: _startDate,
            policyExpiryDate: _expiryDate,
            isActive: true
        });

        vehicleRecordSC.updateInsurance(_vehicleId, _insuranceId);
    }

    /**
     * @dev Vehicle owner submits a claim request.
     */
    function requestClaim(
        string memory _claimId,
        string memory _insuranceId,
        string memory _vehicleId,
        string memory _reason,
        string memory _ownerId,
        uint256 _claimedAmount
    ) public {
        require(bytes(insurances[_insuranceId].insuranceId).length != 0, "Insurance not found");
        require(claims[_claimId].claimedAmount == 0, "Claim already exists");

        claims[_claimId] = Claim({
            claimId: _claimId,
            insuranceId: _insuranceId,
            vehicleId: _vehicleId,
            ownerId: _ownerId,
            reason: _reason,
            claimedAmount: _claimedAmount,
            approvedAmount: 0,
            isApproved: false,
            isSettled: false
        });
        vehicleRecordSC.linkClaim(_vehicleId, _claimId);
    }

    /**
     * @dev Insurer approves or partially approves a claim based on eligibility.
     */
    function approveClaim(
        string memory _claimId,
        uint256 _approvedAmount
    ) public onlyInsurer {
        Claim storage claim = claims[_claimId];
        Insurance memory ins = insurances[claim.insuranceId];

        require(!claim.isApproved, "Already approved");
        require(_approvedAmount <= ins.coverageLimit, "Above coverage limit");
        require(_approvedAmount <= claim.claimedAmount, "Cannot approve more than claimed");

        claim.approvedAmount = _approvedAmount;
        claim.isApproved = true;
    }

    /**
     * @dev Settle the claim — insurer pays the approved amount to vehicle owner.
     */
    function settleClaim(string memory _claimId) public payable onlyInsurer {
        Claim storage claim = claims[_claimId];
        Insurance memory ins = insurances[claim.insuranceId];
        VehicleRecord.Vehicle memory vehicle = vehicleRecordSC.getVehicle(claim.vehicleId);

        require(claim.isApproved, "Claim not approved");
        require(!claim.isSettled, "Already settled");
        require(msg.value >= claim.approvedAmount, "Insufficient payment");

        // Pay approved claim amount to the vehicle owner
        vehicle.currentOwnerAddress.transfer(claim.approvedAmount);

        claim.isSettled = true;
        vehicleRecordSC.updateClaimSettlement(claim.vehicleId, claim.approvedAmount);
    }

    /**
     * @dev Verify if policy is still active
     */
    function isPolicyActive(string memory _insuranceId) public view returns (bool) {
        Insurance memory ins = insurances[_insuranceId];
        return (block.timestamp >= ins.policyStartDate &&
                block.timestamp <= ins.policyExpiryDate &&
                ins.isActive);
    }

    function getInsuranceInfo(string memory _insuranceId) public view returns (Insurance memory) {
        require(bytes(insurances[_insuranceId].insuranceId).length != 0, "Insurance Policy not found");
        return insurances[_insuranceId];
    }

    function getClaimInfo(string memory _claimId) public view returns (Claim memory) {
        require(bytes(claims[_claimId].claimId).length != 0, "Claim not found");
        return claims[_claimId];
    }
}
