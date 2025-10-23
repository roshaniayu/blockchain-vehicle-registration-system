const UserIdentity = artifacts.require("UserIdentity");
const VehicleRecord = artifacts.require("VehicleRecord");
const TrafficRecord = artifacts.require("TrafficRecord");
const InsuranceRecord = artifacts.require("InsuranceRecord");

module.exports = async function (deployer) {
  // Step 1: Deploy UserIdentity
  await deployer.deploy(UserIdentity);
  const userIdentityInstance = await UserIdentity.deployed();
  console.log("✅ UserIdentity deployed at:", userIdentityInstance.address);

  // Step 2: Deploy VehicleRecord with UserIdentity address
  await deployer.deploy(VehicleRecord, userIdentityInstance.address);
  const vehicleRecordInstance = await VehicleRecord.deployed();
  console.log("✅ VehicleRecord deployed at:", vehicleRecordInstance.address);

  // Step 3: Deploy TrafficRecord with UserIdentity + VehicleRecord addresses
  await deployer.deploy(
    TrafficRecord,
    userIdentityInstance.address,
    vehicleRecordInstance.address
  );
  const trafficRecordInstance = await TrafficRecord.deployed();
  console.log("✅ TrafficRecord deployed at:", trafficRecordInstance.address);

  // Step 4: Deploy InsuranceRecord with UserIdentity + VehicleRecord addresses
  await deployer.deploy(
    InsuranceRecord,
    userIdentityInstance.address,
    vehicleRecordInstance.address
  );
  const insuranceRecordInstance = await InsuranceRecord.deployed();
  console.log("✅ InsuranceRecord deployed at:", insuranceRecordInstance.address);

  console.log("\n🎯 Deployment Summary:");
  console.log("UserIdentity:", userIdentityInstance.address);
  console.log("VehicleRecord:", vehicleRecordInstance.address);
  console.log("TrafficRecord:", trafficRecordInstance.address);
  console.log("InsuranceRecord:", insuranceRecordInstance.address);
};
