"use client";

import { useCallback, useState } from "react";

// Error Handler Context
import { useContractError } from "@/utils/apiHooks/useError";

// Contracts
import UserIdentityArtifact from "@/contracts/UserIdentity.json";

// Connections
import { GetCurrentActiveWallet, InitWeb3Contract } from "./_connection";

// Types
import { AddUser_T, SC_userInfo_T } from "@/types/owner";
import { UserType_T } from "@/types/auth";

export function useSC_AddUser() {
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

export function useSC_GetAllUsersByTypes() {
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
