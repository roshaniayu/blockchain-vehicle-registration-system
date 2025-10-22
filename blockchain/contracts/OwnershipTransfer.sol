// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserIdentity.sol";

contract OwnershipTransfer {
    enum State { Created, Locked, Release, Inactive }

    State public state; // initialized to Created by default
    
    struct Ownership {
        uint ownershipId; // PK
        uint vehicleId; // FK
        uint vehicleOwnerId; // FK
        address oldOwner;
        address newOwner;
        uint ownershipStartDate;
        uint ownershipEndDate;
        uint amount;
        bool ownershipSignature;
    }

    mapping(string => Ownership) public ownerships;
    mapping(string => string[]) public transfersByVehicleId;
    mapping(string => string[]) public transfersByVehicleOwnerId;

    address private admin;
    
    UserIdentity public userIdentitySC;

    constructor(address _userIdentityAddress) {
        admin = msg.sender;
        userIdentitySC = UserIdentity(_userIdentityAddress);
    }
}

contract Purchase {

uint public value;
address payable public seller;
address payable public buyer;

enum State { Created, Locked, Release, Inactive }

State public state; // initialized to Created by default

modifier isTwiceValue() { require(msg.value == (2 * value)); _; }
modifier isBuyer() { require(msg.sender == buyer, "buyer only"); _; }
modifier isSeller() { require(msg.sender == seller, "seller only"); _; }
modifier isIn(State _state) { require(state == _state, "invalid state"); _; }

constructor() payable {
seller = payable(msg.sender);
value = msg.value / 2;
require((2 * value) == msg.value, "value must be even");
}

function abort() public isSeller isIn(State.Created) payable {
state = State.Inactive; seller.transfer(address(this).balance); }

function confirmPurchase() public payable isIn(State.Created) isTwiceValue {
buyer = payable(msg.sender); state = State.Locked; }

function confirmReceived() public isBuyer isIn(State.Locked) payable {
state = State.Release; buyer.transfer(value); }

function refundSeller() public isSeller isIn(State.Release) payable {
state = State.Inactive; seller.transfer(3 * value); }
}