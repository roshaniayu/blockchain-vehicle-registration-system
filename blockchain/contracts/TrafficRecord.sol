pragma solidity ^0.8.1;

import "./UserIdentity.sol";
import "./VehicleRecord.sol";

contract TrafficRecord {
    UserIdentity public userIdentitySC;
    VehicleRecord public vehicleRecord;

    address payable public ltaWallet;

    struct Violation {
        string violationId;
        string vehicleId;
        string reason;
        uint256 amount;
        bool paid;
    }

    mapping(string => Violation) public violations;

    event ViolationAdded(string indexed violationId, string vehicleId, uint256 amount);
    event FinePaid(string indexed violationId, address payer, uint256 amount);

    modifier onlySPF() {
        require(userIdentitySC.verifyIsSPF(msg.sender), "Not SPF");
        _;
    }

    constructor(address _userIdentity, address _vehicleRecord, address payable _ltaWallet) {
        userIdentitySC = UserIdentity(_userIdentity);
        vehicleRecord = VehicleRecord(_vehicleRecord);
        ltaWallet = _ltaWallet;
    }

    function recordViolation(
        string memory _violationId,
        string memory _vehicleId,
        string memory _reason,
        uint256 _amount
    ) public onlySPF {
        require(bytes(violations[_violationId].violationId).length == 0, "Exists");
        violations[_violationId] = Violation(_violationId, _vehicleId, _reason, _amount, false);
        vehicleRecord.linkAccident(_vehicleId, _violationId);
        emit ViolationAdded(_violationId, _vehicleId, _amount);
    }

    function payFine(string memory _violationId) public payable {
        Violation storage v = violations[_violationId];
        VehicleRecord.Vehicle memory veh = vehicleRecord.getVehicle(v.vehicleId);

        require(msg.sender == veh.currentOwnerAddress, "Not owner");
        require(msg.value == v.amount, "Incorrect fine");
        require(!v.paid, "Already paid");

        (bool sent, ) = ltaWallet.call{value: msg.value}("");
        require(sent, "Payment failed");
        v.paid = true;
        vehicleRecord.updateFinePayment(v.vehicleId, v.amount);
        emit FinePaid(_violationId, msg.sender, msg.value);
    }
}
