// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract UserIdentity {
    enum Role { VEHICLE_OWNER, LTA, SPF, INSURANCE }

    struct User {
        uint id;
        address userAddress;
        string username;
        Role role;
    }
    
    address admin;

    uint vehicleOwnersCount = 0;
    uint ltasCount = 0;
    uint spfsCount = 0;
    uint insurancesCount = 0;

    mapping(address => User) private vehicleOwners;
    mapping(address => User) private ltas;
    mapping(address => User) private spfs;
    mapping(address => User) private insurances;

    address[] private vehicleOwnersAddresses;
    address[] private ltasAddresses;
    address[] private spfsAddresses;
    address[] private insurancesAddresses;

    constructor() {
        admin = msg.sender;
    }

    modifier isAdmin() {
        require(admin == msg.sender, 'Admin Only');
        _;
    }
    
    function verifyIsVehicleOwner(address _address) public view returns(bool) {
    if (vehicleOwners[_address].userAddress == address(0)) {
        return false; // user not registered
    }
    return vehicleOwners[_address].role == Role.VEHICLE_OWNER;
}

    function verifyIsLTA(address _address) public view returns(bool) {
        if (ltas[_address].userAddress == address(0)) {
        return false; // user not registered
    }
    return ltas[_address].role == Role.LTA;
    }

    function verifyIsSPF(address _address) public view returns(bool) {
        if (spfs[_address].userAddress == address(0)) {
        return false; // user not registered
    }
    return spfs[_address].role == Role.SPF;
    }
    
    function verifyIsInsurance(address _address) public view returns(bool) {
         if (insurances[_address].userAddress == address(0)) {
        return false; // user not registered
    }
    return insurances[_address].role == Role.INSURANCE;
    }

    function addVehicleOwner(address _address, string memory _username) 
        public isAdmin()
    {
        vehicleOwnersCount = vehicleOwnersCount + 1;
        User memory user = User(vehicleOwnersCount, _address, _username, Role.VEHICLE_OWNER );
        vehicleOwners[_address] = user;
        vehicleOwnersAddresses.push(_address);
    }

    function addLTA(address _address, string memory _username) 
        public isAdmin()
    {
        ltasCount = ltasCount + 1;
        User memory user = User(ltasCount, _address, _username, Role.LTA );
        ltas[_address] = user;
        ltasAddresses.push(_address);
    }

    function addSPF(address _address, string memory _username) 
        public isAdmin()
    {
        spfsCount = spfsCount + 1;
        User memory user = User(spfsCount, _address, _username, Role.SPF );
        spfs[_address] = user;
        spfsAddresses.push(_address);
    }

    function addInsurance(address _address, string memory _username) 
        public isAdmin()
    {
        insurancesCount = insurancesCount + 1;
        User memory user = User(insurancesCount, _address, _username, Role.INSURANCE );
        insurances[_address] = user;
        insurancesAddresses.push(_address);
    }

    function getAllVehicleOwners() public view returns (User[] memory){
        User[] memory ret = new User[](vehicleOwnersCount);
        for (uint i = 0; i < vehicleOwnersCount; i++) {
            ret[i] = vehicleOwners[vehicleOwnersAddresses[i]];
        }
        return ret;
    }
    
    function getAllLTAs() public view returns (User[] memory){
        User[] memory ret = new User[](ltasCount);
        for (uint i = 0; i < ltasCount; i++) {
            ret[i] = ltas[ltasAddresses[i]];
        }
        return ret;
    }

    function getAllSPFs() public view returns (User[] memory){
        User[] memory ret = new User[](spfsCount);
        for (uint i = 0; i < spfsCount; i++) {
            ret[i] = spfs[spfsAddresses[i]];
        }
        return ret;
    }
    
    function getAllInsurances() public view returns (User[] memory){
        User[] memory ret = new User[](insurancesCount);
        for (uint i = 0; i < insurancesCount; i++) {
            ret[i] = insurances[insurancesAddresses[i]];
        }
        return ret;
    }

    function getUserId(address _address) public view returns (string memory) {
    if (vehicleOwners[_address].userAddress != address(0)) {
        return vehicleOwners[_address].username;
    }
    if (ltas[_address].userAddress != address(0)) {
        return ltas[_address].username;
    }
    if (spfs[_address].userAddress != address(0)) {
        return spfs[_address].username;
    }
    if (insurances[_address].userAddress != address(0)) {
        return insurances[_address].username;
    }
    revert("User not found");
}


}