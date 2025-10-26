const InsuranceRecord = artifacts.require("InsuranceRecord");
const UserIdentity = artifacts.require("UserIdentity");
const VehicleRecord = artifacts.require("VehicleRecord");

module.exports = async function (deployer) {
  console.log("Deploying InsuranceRecord...");
  
  const userIdentity = await UserIdentity.deployed();
  const vehicleRecord = await VehicleRecord.deployed();
  
  console.log("UserIdentity address:", userIdentity.address);
  console.log("VehicleRecord address:", vehicleRecord.address);
  
  await deployer.deploy(
    InsuranceRecord, 
    userIdentity.address, 
    vehicleRecord.address, 
    { gas: 5000000 }
  );
};