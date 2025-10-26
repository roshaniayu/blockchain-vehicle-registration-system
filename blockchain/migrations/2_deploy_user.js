const UserIdentity = artifacts.require("UserIdentity");

module.exports = function (deployer) {
  console.log("Deploying UserIdentity...");
  deployer.deploy(UserIdentity, { gas: 3000000 });
};