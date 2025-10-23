pragma solidity ^0.8.1;

interface IVehicleRecord {
    struct Vehicle {
        string vehicleId;
        string[] accidentIds;
        string insuranceId;
        uint256 coeDate;
        uint256 manufactureDate;
        string manufactureCompany;
        uint256 modelNo;
        bool vehicleSignature;
    }

    function getVehicleDetail(string memory _vehicleId) external view returns (Vehicle memory);
    function verifyVehicle(string memory _vehicleId) external view returns (bool);
    function linkAccidentRecord(string memory _vehicleId, string memory _accidentId) external;
    function modifyInsuranceId(string memory _vehicleId, string memory _insuranceId) external;
}

interface IOwnershipRecord {
    function activeOwnershipOfVehicle(string memory _vehicleId) external view returns (string memory);
    function getOwnershipByVehicleId(string memory _vehicleId) external view returns (string[] memory);
}

interface IUserIdentity {
    function verifyIsLTA(address _addr) external view returns (bool);
    function verifyIsSPF(address _addr) external view returns (bool);
    function verifyIsInsurance(address _addr) external view returns (bool);
    function verifyIsVehicleOwner(address _addr) external view returns (bool);
}