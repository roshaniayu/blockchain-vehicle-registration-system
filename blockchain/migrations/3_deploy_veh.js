const VehicleRecord = artifacts.require("VehicleRecord");
const UserIdentity = artifacts.require("UserIdentity");

module.exports = async function (deployer) {
  console.log("Deploying VehicleRecord...");
  
  const userIdentity = await UserIdentity.deployed();
  console.log("UserIdentity address:", userIdentity.address);
  
  await deployer.deploy(VehicleRecord, userIdentity.address, { gas: 4000000 });
};