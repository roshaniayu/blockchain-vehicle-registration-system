"use client";

import { useCallback, useState } from "react";

// Error Handler Context
import { useContractError } from "@/utils/apiHooks/useError";

// Contracts
import VehicleRecordArtifact from "@/contracts/VehicleRecord.json";

// Connections
import { InitWeb3Contract } from "./_connection";

// Types
import { VehicleInfo_T } from "@/types/vehicles";

export async function AddVehicle(data: {
  vehicleId: string;
  ownerId: string;
  ownerAddress: string;
  coeStartDate: number;
  coeExpiryDate: number;
  manufactureDate: number;
  company: string;
  modelNo: string;
}) {
  const contract = await InitWeb3Contract(VehicleRecordArtifact);
  if (!contract) return;

  // Request account access and get the current user's address (Signer equivalent)
  const accounts = await (window as any).ethereum.request({
    method: "eth_requestAccounts",
  });

  const userAddress = accounts[0];
  const response = await contract.methods
    .addVehicle(
      data.vehicleId,
      data.ownerId,
      data.ownerAddress,
      data.coeStartDate,
      data.coeExpiryDate,
      data.manufactureDate,
      data.company,
      data.modelNo
    )
    .send({ from: userAddress })
    .catch((e) => console.log(e));
  return response;
}

export function useSC_GetVehicleInfo() {
  const { setErrorContract } = useContractError();
  const [data, setData] = useState<VehicleInfo_T | null>();
  const [loading, setLoading] = useState(false);

  const smartContract = async (vehicleId: string) => {
    setLoading(true); // Set Loading

    const contract = await InitWeb3Contract(VehicleRecordArtifact);
    if (!contract) return;

    setLoading(true); // Set Loading
    setData(null);
    try {
      await contract.methods
        .getVehicle(vehicleId)
        .call()
        .then((response) =>
          setData((response as unknown as VehicleInfo_T) ?? null)
        );
    } catch (e) {
      setErrorContract(e as string);
      setData(null);
    } finally {
      setLoading(false); // Remove Loading
    }
  };

  const get = useCallback(async (vehicleId: string) => {
    smartContract(vehicleId);
  }, []);

  return { data, loading, get };
}
