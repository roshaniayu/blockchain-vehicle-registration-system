"use client";

import Web3 from "web3";
import { useCallback, useState } from "react";

import InsuranceRecordArtifact from "@/contracts/InsuranceRecord.json";
import { GetCurrentActiveWallet, InitWeb3Contract } from "./_connection";
import {
  ClaimForm_T,
  ClaimInfo_T,
  InsuranceInfo_T,
  PolicyInfo_T,
} from "@/types/insurance";

import { useContractError } from "@/utils/apiHooks/useError";

export function use_SC_AddInsurance() {
  const { setErrorContract } = useContractError();

  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (dataset: Partial<PolicyInfo_T>) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(InsuranceRecordArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();
    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .addInsurance(
          dataset.insuranceId,
          dataset.vehicleId,
          dataset.insurerId,
          dataset.insurerAddress,
          dataset.policyType,
          dataset.premiumAmount,
          dataset.coverageLimit,
          dataset.startDate,
          dataset.expiryDate
        )
        .send({ from: currentAddress })
        .then(() => setData(dataset.insuranceId))
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

export function use_SC_RequestClaim() {
  const { setErrorContract } = useContractError();

  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (dataset: Partial<ClaimForm_T>) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(InsuranceRecordArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();
    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .requestClaim(
          dataset.claimId,
          dataset.insuranceId,
          dataset.vehicleId,
          dataset.claimReason,
          dataset.ownerId,
          dataset.claimedAmount
        )
        .send({ from: currentAddress })
        .then(() => setData(dataset.claimId))
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

export function use_SC_ApproveClaim() {
  const { setErrorContract } = useContractError();

  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (claimId: string, amount: number) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(InsuranceRecordArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();

    try {
      setLoading(true); // Set Loading
      setData(null);
      contract.methods
        .approveClaim(claimId, amount)
        .send({ from: currentAddress })
        .then(() => setData(claimId))
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

export function use_SC_SettleClaim() {
  const { setErrorContract } = useContractError();

  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (claimId: string, amount: number) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(InsuranceRecordArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();

    try {
      setLoading(true); // Set Loading
      setData(null);
      contract.methods
        .settleClaim(claimId)
        .send({
          from: currentAddress,
          value: Web3.utils.toWei(amount, "wei"),
        })
        .then(() => setData(claimId))
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

// export async function IsPolicyActive(insuranceId: string) {
//   const contract = await InitWeb3Contract(InsuranceRecordArtifact);
//   if (!contract) return;

//   // Request account access and get the current user's address (Signer equivalent)
//   const accounts = await (window as any).ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const userAddress = accounts[0];

//   return await contract.methods
//     .isPolicyActive(insuranceId)
//     .send({ from: userAddress });
// }

export function use_SC_GetInsuranceInfo() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<InsuranceInfo_T | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (insuranceId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(InsuranceRecordArtifact);
    if (!contract) return;
    setLoading(true); // Set Loading
    setData(null);
    try {
      await contract.methods
        .getInsuranceInfo(insuranceId)
        .call()
        .then((response) =>
          setData((response as unknown as InsuranceInfo_T) ?? null)
        );
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, get: smartContract };
}

export function use_SC_GetClaimInfo() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<ClaimInfo_T | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (claimId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(InsuranceRecordArtifact);
    if (!contract) return;
    setLoading(true); // Set Loading
    setData(null);
    try {
      await contract.methods
        .getClaimInfo(claimId)
        .call()
        .then((response) =>
          setData((response as unknown as ClaimInfo_T) ?? null)
        );
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  }, []);

  return { data, loading, get: smartContract };
}
