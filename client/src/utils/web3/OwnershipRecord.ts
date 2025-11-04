"use client";

import OwnershipArtifact from "@/contracts/OwnershipRecord.json";
import { GetCurrentActiveWallet, InitWeb3Contract } from "./_connection";
import Web3 from "web3";
import { useCallback, useState } from "react";
import { useContractError } from "@/utils/apiHooks/useError";
import {
  ListVehicleForSale_T,
  MintVehicleOwnership_T,
  SaleInfo_T,
} from "@/types/ownership";

// onlyLTA
export function use_SC_MintVehicleOwnership() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (dataset: MintVehicleOwnership_T) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(OwnershipArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();
    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .mintVehicleOwnership(
          dataset.vehicleId,
          dataset.owner,
          dataset.coeStart,
          dataset.coeExpiry,
          dataset.tokenURI
        )
        .send({ from: currentAddress })
        .then((response) => setData(response));
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, send: smartContract };
}

export function use_SC_GetSaleInfo() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<SaleInfo_T | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (vehicleId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(OwnershipArtifact);
    if (!contract) return;
    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .isListed(vehicleId)
        .call()
        .then((response) => setData(response as unknown as SaleInfo_T))
        .catch((e) => setErrorContract(e.message));
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, get: smartContract };
}

export function use_SC_ListVehicleForSale() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (dataset: ListVehicleForSale_T) => {
    setLoading(true); // Set Loading
    console.log(dataset);
    const contract = await InitWeb3Contract(OwnershipArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();

    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .listVehicleForSale(dataset.vehicleId, dataset.price)
        .send({ from: currentAddress })
        .then(() => setData(dataset.vehicleId))
        .catch((e) => setErrorContract(""));
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, send: smartContract };
}

export function use_SC_CancelSale() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (vehicleId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(OwnershipArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();

    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .cancelSale(vehicleId)
        .send({ from: currentAddress })
        .then((receipt) => setData(receipt))
        .catch((e) => setErrorContract(e.message));
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, send: smartContract };
}

export function use_SC_PurchaseVehicle() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(
    async (vehicleId: string, amount: number) => {
      setLoading(true); // Set Loading

      const contract = await InitWeb3Contract(OwnershipArtifact);
      if (!contract) return;

      // Request account access and get the current user's address (Signer equivalent)
      const currentAddress = await GetCurrentActiveWallet();

      try {
        setLoading(true); // Set Loading
        setData(null);
        await contract.methods
          .purchaseVehicle(vehicleId)
          .send({
            from: currentAddress,
            value: Web3.utils.toWei(amount, "wei"),
          })
          .then(() => setData(vehicleId))
          .catch((e) => setErrorContract(e.message));
      } catch (e) {
        setErrorContract(e as string);
        setData(null);
      } finally {
        setLoading(false); // Remove Loading
      }
    },
    []
  );

  return { data, loading, send: smartContract };
}

// onlyLTA
export function use_SC_RevokeOwnership() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (vehicleId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(OwnershipArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();

    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .revokeOwnership(vehicleId)
        .send({ from: currentAddress })
        .then((receipt) => setData(receipt))
        .catch((e) => setErrorContract(e.message));
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, send: smartContract };
}

export function use_SC_TansferOwnershipRecord() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(
    async (vehicleId: string, newOwnerAddress: string) => {
      setLoading(true); // Set Loading

      const contract = await InitWeb3Contract(OwnershipArtifact);
      if (!contract) return;

      // Request account access and get the current user's address (Signer equivalent)
      const currentAddress = await GetCurrentActiveWallet();

      try {
        setLoading(true); // Set Loading
        setData(null);
        await contract.methods
          .transferOwnershipRecord(vehicleId, newOwnerAddress)
          .send({ from: currentAddress })
          .then(() => setData(newOwnerAddress))
          .catch((e) => setErrorContract(e.message));
      } catch (e) {
        setErrorContract(e as string);
        setData(null);
      } finally {
        setLoading(false); // Remove Loading
      }
    },
    []
  );

  return { data, loading, send: smartContract };
}

// onlyLTA
export function use_SC_GetVehicleOwnership() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (vehicleId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(OwnershipArtifact);
    if (!contract) return;

    setLoading(true); // Set Loading
    setData(null);
    try {
      await contract.methods
        .getVehicleOwner(vehicleId)
        .call()
        .then((response) => {
          setData((response as unknown as string) ?? null);
        })
        .catch((e) => setErrorContract(""));
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, get: smartContract };
}
