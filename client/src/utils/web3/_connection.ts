"use client";

import Web3 from "web3";

export async function InitWeb3Contract(Artifact: any) {
  if (typeof (window as any).ethereum !== "undefined") {
    const abi = Artifact.abi;
    const contractAddress = Artifact.networks[5777].address;

    const web3 = new Web3((window as any).ethereum);

    // Create the Contract instance
    const contract = new web3.eth.Contract(abi, contractAddress);

    return contract;
  }
  console.log("MetaMask not installed");
  return null;
}

export async function GetCurrentActiveWallet() {
  if (typeof (window as any).ethereum !== "undefined") {
    // Request account access and get the current user's address (Signer equivalent)
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const userAddress = accounts[0];

    return userAddress;
  }
  console.log("MetaMask not installed");
  return null;
}
