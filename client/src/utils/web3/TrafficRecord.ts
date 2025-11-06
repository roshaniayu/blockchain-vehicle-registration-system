"use client";

import Web3 from "web3";
import { useCallback, useState } from "react";

// Error Handler Context
import { useContractError } from "@/utils/apiHooks/useError";

// Contracts
import TrafficRecordArtifact from "@/contracts/TrafficRecord.json";

// Connections
import { GetCurrentActiveWallet, InitWeb3Contract } from "./_connection";

// Types
import { TicketForm_T, TicketInfo_T } from "@/types/tickets";

export function useSC_RecordViolation() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(async (dataset: Partial<TicketForm_T>) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(TrafficRecordArtifact);
    if (!contract) return;

    // Request account access and get the current user's address (Signer equivalent)
    const currentAddress = await GetCurrentActiveWallet();
    try {
      setLoading(true); // Set Loading
      setData(null);
      await contract.methods
        .recordViolation(
          dataset.violationId,
          dataset.vehicleId,
          dataset.reason,
          dataset.amount
        )
        .send({ from: currentAddress })
        .then(() => setData(dataset.violationId))
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

export function useSC_PayFine() {
  const { setErrorContract } = useContractError();

  const [data, setData] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = useCallback(
    async (violationId: string, amount: string) => {
      setLoading(true); // Set Loading

      const contract = await InitWeb3Contract(TrafficRecordArtifact);
      if (!contract) return;

      // Request account access and get the current user's address (Signer equivalent)
      const currentAddress = await GetCurrentActiveWallet();

      try {
        setLoading(true); // Set Loading
        setData(null);
        contract.methods
          .payFine(violationId)
          .send({
            from: currentAddress,
            value: Web3.utils.toWei(amount, "wei"),
          })
          .then(() => setData(violationId))
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

export function useSC_GetTicketInfo() {
  const [data, setData] = useState<TicketInfo_T | null>();
  const [loading, setLoading] = useState(false);

  const { setErrorContract } = useContractError();

  const smartContract = async (accidentId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(TrafficRecordArtifact);
    if (!contract) return;
    setLoading(true); // Set Loading
    setData(null);
    try {
      await contract.methods
        .getTicketInfo(accidentId)
        .call()
        .then((response) =>
          setData((response as unknown as TicketInfo_T) ?? null)
        )
        .catch((e) => setErrorContract(e.message));
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  };

  const get = useCallback(async (accidentId: string) => {
    smartContract(accidentId);
  }, []);

  return { data, loading, get };
}
