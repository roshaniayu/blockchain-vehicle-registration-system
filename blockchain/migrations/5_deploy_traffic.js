const TrafficRecord = artifacts.require("TrafficRecord");
const UserIdentity = artifacts.require("UserIdentity");
const VehicleRecord = artifacts.require("VehicleRecord");

module.exports = async function (deployer, network, accounts) {
  console.log("Deploying TrafficRecord...");
  
  const userIdentity = await UserIdentity.deployed();
  const vehicleRecord = await VehicleRecord.deployed();
  
  console.log("UserIdentity address:", userIdentity.address);
  console.log("VehicleRecord address:", vehicleRecord.address);
  console.log("LTA Wallet address:", accounts[0]);
  
  await deployer.deploy(
    TrafficRecord, 
    userIdentity.address, 
    vehicleRecord.address, 
    accounts[0], 
    { gas: 5000000 }
  );
};