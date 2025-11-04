// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./UserIdentity.sol";
import "./VehicleRecord.sol";

/**
 * @title OwnershipRecord
 * @dev Tokenized vehicle ownership integrated with UserIdentity and VehicleRecord.
 */
contract OwnershipRecord is ERC721URIStorage, Ownable {
    UserIdentity public userIdentity;
    VehicleRecord public vehicleRecord;

    struct VehicleOwnership {
        string vehicleId;
        address ownerAddress;
        uint256 coeStart;
        uint256 coeExpiry;
        bool isActive;
    }

    struct VehicleSale {
    uint256 price;      // sale price in wei
    bool isListed;      // true if vehicle is listed for sale
}
mapping(string => VehicleSale) public vehicleSales;
     // 🟩 Pass `initialOwner` to `Ownable` constructor
    constructor(
        // address _initialOwner,
        address _userIdentity,
        address _vehicleRecord
    ) ERC721("VehicleOwnershipToken", "VOT") Ownable() {
        userIdentity = UserIdentity(_userIdentity);
        vehicleRecord = VehicleRecord(_vehicleRecord);
    }
    mapping(string => VehicleOwnership) public ownershipDetails;
    mapping(string => uint256) public vehicleToTokenId;
    uint256 private _tokenIds;

    event VehicleMinted(address indexed owner, string vehicleId, uint256 tokenId);
    event OwnershipTransferred(string vehicleId, address indexed from, address indexed to, uint256 tokenId);
    event OwnershipRevoked(string vehicleId, address indexed owner);

    modifier onlyLTA() {
        require(userIdentity.verifyIsLTA(msg.sender), "Caller is not LTA");
        _;
    }

    /**
     * @notice Mint NFT ownership only by LTA for verified vehicle records.
     */
    function mintVehicleOwnership(
        string memory _vehicleId,
        address _owner,
        uint256 _coeStart,
        uint256 _coeExpiry,
        string memory _tokenURI
    ) external onlyLTA returns (uint256) {
        require(vehicleRecord.isVehicleExist(_vehicleId), "Vehicle not registered");
        require(vehicleToTokenId[_vehicleId] == 0, "Vehicle already tokenized");

        _tokenIds += 1;
        uint256 tokenId = _tokenIds;

        _mint(_owner, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        ownershipDetails[_vehicleId] = VehicleOwnership({
            vehicleId: _vehicleId,
            ownerAddress: _owner,
            coeStart: _coeStart,
            coeExpiry: _coeExpiry,
            isActive: true
        });

        vehicleToTokenId[_vehicleId] = tokenId;
        emit VehicleMinted(_owner, _vehicleId, tokenId);
        return tokenId;
    }

    function listVehicleForSale(string memory _vehicleId, uint256 _price) external {
    uint256 tokenId = vehicleToTokenId[_vehicleId];
    require(tokenId != 0, "Vehicle not found");
    require(ownerOf(tokenId) == msg.sender, "Not vehicle owner");
    require(_price > 0, "Invalid price");

    vehicleSales[_vehicleId] = VehicleSale({
        price: _price,
        isListed: true
    });
}

    function isListed(string memory _vehicleId) external view returns (VehicleSale memory) {
        return vehicleSales[_vehicleId];
}

function cancelSale(string memory _vehicleId) external {
    uint256 tokenId = vehicleToTokenId[_vehicleId];
    require(tokenId != 0, "Vehicle not found");
    require(ownerOf(tokenId) == msg.sender, "Not vehicle owner");
    require(vehicleSales[_vehicleId].isListed, "Not listed");

    vehicleSales[_vehicleId].isListed = false;
}

function purchaseVehicle(string memory _vehicleId) external payable {
    uint256 tokenId = vehicleToTokenId[_vehicleId];
    require(tokenId != 0, "Vehicle not found");

    VehicleSale memory sale = vehicleSales[_vehicleId];
    require(sale.isListed, "Vehicle not for sale");
    require(msg.value == sale.price, "Incorrect payment amount");

    address seller = ownerOf(tokenId);

    // ✅ Payment check passed — transfer ETH first
    payable(seller).transfer(msg.value);

    // ✅ Then transfer NFT to buyer
    _transfer(seller, msg.sender, tokenId);

    // Update mappings
    ownershipDetails[_vehicleId].ownerAddress = msg.sender;
    vehicleSales[_vehicleId].isListed = false;

    emit OwnershipTransferred(_vehicleId, seller, msg.sender, tokenId);
}

    /**
     * @notice Transfer vehicle ownership (NFT) to another user.
     */
    function transferOwnershipRecord(string memory _vehicleId, address _newOwner) external {
        uint256 tokenId = vehicleToTokenId[_vehicleId];
        require(tokenId != 0, "Vehicle not found");
        require(ownerOf(tokenId) == msg.sender, "Not vehicle owner");

        _transfer(msg.sender, _newOwner, tokenId);
        ownershipDetails[_vehicleId].ownerAddress = _newOwner;
        vehicleRecord.updateOwner(_vehicleId, userIdentity.getUserId(_newOwner), payable(_newOwner));

        emit OwnershipTransferred(_vehicleId, msg.sender, _newOwner, tokenId);
    }

    /**
     * @notice Revoke vehicle ownership (burn NFT) by LTA.
     */
    function revokeOwnership(string memory _vehicleId) external onlyLTA {
        uint256 tokenId = vehicleToTokenId[_vehicleId];
        require(tokenId != 0, "Vehicle not found");

        address tokenOwner = ownerOf(tokenId);
        _burn(tokenId);

        ownershipDetails[_vehicleId].isActive = false;
        vehicleToTokenId[_vehicleId] = 0;

        emit OwnershipRevoked(_vehicleId, tokenOwner);
    }

    function getVehicleOwner(string memory _vehicleId) external view returns (address) {
        uint256 tokenId = vehicleToTokenId[_vehicleId];
        require(tokenId != 0, "Vehicle not found");
        return ownerOf(tokenId);
    }

    function isCOEValid(string memory _vehicleId) external view returns (bool) {
        VehicleOwnership memory v = ownershipDetails[_vehicleId];
        return (v.isActive && block.timestamp < v.coeExpiry);
    }
    function getTokenId(string memory _vehicleId) public view returns (uint256) {
    return vehicleToTokenId[_vehicleId];
}

}
