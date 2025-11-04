"use client";

import VehicleRecordArtifact from "@/contracts/VehicleRecord.json";
import { InitWeb3Contract } from "./_connection";
import { VehicleInfo_T } from "@/types/vehicles";
import { useContractError } from "@/utils/apiHooks/useError";
import { useCallback, useState } from "react";

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

// export async function UpdateOwner(
//   vehicleId: string,
//   newOwnerId: string,
//   newOwnerAddr: string
// ) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   // Request account access and get the current user's address (Signer equivalent)
//   const accounts = await (window as any).ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const userAddress = accounts[0];

//   return await contract.methods
//     .addVehicle(vehicleId, newOwnerId, newOwnerAddr)
//     .send({ from: userAddress });
// }

// export async function UpdateFinePayment(vehicleId: string, amount: number) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   // Request account access and get the current user's address (Signer equivalent)
//   const accounts = await (window as any).ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const userAddress = accounts[0];

//   return await contract.methods
//     .UpdateFinePayment(vehicleId, amount)
//     .send({ from: userAddress });
// }

// export async function UpdateClaimSettlement(
//   vehicleId: string,
//   claimId: string,
//   amount: number
// ) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   // Request account access and get the current user's address (Signer equivalent)
//   const accounts = await (window as any).ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const userAddress = accounts[0];

//   return await contract.methods
//     .updateClaimSettlement(vehicleId, claimId, amount)
//     .send({ from: userAddress });
// }

// export async function LinkAccident(vehicleId: string, accidentId: string) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   // Request account access and get the current user's address (Signer equivalent)
//   const accounts = await (window as any).ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const userAddress = accounts[0];

//   return await contract.methods.linkAccident(vehicleId, accidentId).call();
// }

// export async function UpdateInsurance(vehicleId: string, insuranceId: string) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   // Request account access and get the current user's address (Signer equivalent)
//   const accounts = await (window as any).ethereum.request({
//     method: "eth_requestAccounts",
//   });
//   const userAddress = accounts[0];

//   return await contract.methods
//     .updateInsurance(vehicleId, insuranceId)
//     .send({ from: userAddress });
// }

// export async function IsCOEActive(vehicleId: string) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   return await contract.methods.isCOEActive(vehicleId).call();
// }

// export async function GetTotalFinesPaid(vehicleId: string) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   return await contract.methods.getTotalFinesPaid(vehicleId).call();
// }

// export async function GetTotalClaimsReceive(vehicleId: string) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   return await contract.methods.getTotalClaimsReceived(vehicleId).call();
// }

// export async function GetClaimIds(vehicleId: string) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   return await contract.methods.getClaimIds(vehicleId).call();
// }

export function use_SC_GetVehicleInfo() {
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

// export async function IsVehicleExist(vehicleId: string) {
//   const contract = await InitWeb3Contract(VehicleRecordArtifact);
//   if (!contract) return;

//   return await contract.methods.isVehicleExist(vehicleId).call();
// }
