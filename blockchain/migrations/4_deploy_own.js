const OwnershipRecord = artifacts.require("OwnershipRecord");
const UserIdentity = artifacts.require("UserIdentity");
const VehicleRecord = artifacts.require("VehicleRecord");

module.exports = async function (deployer, network, accounts) {
  console.log("Deploying OwnershipRecord...");
  
  const userIdentity = await UserIdentity.deployed();
  const vehicleRecord = await VehicleRecord.deployed();
  
  console.log("UserIdentity address:", userIdentity.address);
  console.log("VehicleRecord address:", vehicleRecord.address);

  
  await deployer.deploy(
    OwnershipRecord, 
    userIdentity.address,  // _userIdentity
    vehicleRecord.address, // _vehicleRecord
    { gas: 6000000 }
  );
};