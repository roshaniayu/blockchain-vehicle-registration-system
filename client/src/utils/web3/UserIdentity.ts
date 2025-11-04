"use client";

import UserIdentityArtifact from "@/contracts/UserIdentity.json";
import { GetCurrentActiveWallet, InitWeb3Contract } from "./_connection";
import { AddUser_T, SC_userInfo_T } from "@/types/owner";
import { useCallback, useState } from "react";
import { useContractError } from "@/utils/apiHooks/useError";
import { UserType_T } from "@/types/auth";

export function use_SC_AddUser() {
  const { setErrorContract } = useContractError();

  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (dataset: AddUser_T) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(UserIdentityArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();
    try {
      setLoading(true); // Set Loading
      setData(null);
      switch (dataset.UserType) {
        case "LTA":
          return await contract.methods
            .addLTA(dataset.Address, dataset.UserName)
            .send({ from: currentAddress })
            .then(() => setData(dataset.UserName));
        case "VEHICLE_OWNER":
          return await contract.methods
            .addVehicleOwner(dataset.Address, dataset.UserName)
            .send({ from: currentAddress })
            .then(() => {
              console.log(dataset.UserName);
              setData(dataset.UserName);
            });
        case "SPF":
          return await contract.methods
            .addSPF(dataset.Address, dataset.UserName)
            .send({ from: currentAddress })
            .then(() => setData(dataset.UserName));
        case "INSURANCE":
          return await contract.methods
            .addInsurance(dataset.Address, dataset.UserName)
            .send({ from: currentAddress })
            .then(() => setData(dataset.UserName));
      }
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, send: smartContract };
}

export function use_SC_GetAllUsersByTypes() {
  const { setErrorContract } = useContractError();

  const [data, setData] = useState<SC_userInfo_T[] | null>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const smartContract = async (UserType: UserType_T) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(UserIdentityArtifact);
    if (!contract) return;

    try {
      setLoading(true); // Set Loading
      setData(null);
      switch (UserType) {
        case "LTA":
          return await contract.methods
            .getAllLTAs()
            .call()
            .then((response) => setData(response ?? null));
        case "VEHICLE_OWNER":
          return await contract.methods
            .getAllVehicleOwners()
            .call()
            .then((response) => setData(response ?? null));
        case "SPF":
          return await contract.methods
            .getAllSPFs()
            .call()
            .then((response) => setData(response ?? null));
        case "INSURANCE":
          return await contract.methods
            .getAllInsurances()
            .call()
            .then((response) => setData(response ?? null));
      }
    } catch (e) {
      setErrorContract(e as string);
      setError(e);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  };

  const get = useCallback(async (UserType: UserType_T) => {
    smartContract(UserType);
  }, []);

  return { data, error, loading, get };
}

// export async function VerifyUser(
//   UserType: "LTA" | "SPF" | "INSURANCE",
//   Address?: string
// ) {
//   const contract = await InitWeb3Contract(UserIdentityArtifact);
//   if (!contract) return;

//   // Request account access and get the current user's address (Signer equivalent)
//   const accounts = await (window as any).ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const userAddress = accounts[0];

//   switch (UserType) {
//     case "LTA":
//       return await contract.methods.verifyIsLTA(Address ?? userAddress).call();
//     case "SPF":
//       return await contract.methods.verifyIsSPF(Address ?? userAddress).call();
//     case "INSURANCE":
//       return await contract.methods
//         .verifyIsInsurance(Address ?? userAddress)
//         .call();
//   }
// }

export async function GetUserName(Address: string) {
  const contract = await InitWeb3Contract(UserIdentityArtifact);
  if (!contract) return;

  return await contract.methods.getUserId(Address).call();
}
