"use client";

import { useEffect, useState } from "react";
import {
  useSaleVehicleList,
  useVehicleList,
} from "@/utils/apiHooks/useVehicle";
import { VehicleCard } from "@/components/cards/VehicleCard";

import { useLogin } from "@/utils/apiHooks/useAuth";

// Web3
import * as VehicleRecord from "@/utils/web3/VehicleRecord";
import * as OwnershipRecord from "@/utils/web3/OwnershipRecord";

import { CreateClaimsPopupBtn } from "../insurance/components/claims/createClaimsPopupBtn";
import { Button, ButtonOutline } from "@/components/ui/buttons/buttons";
import { NumberInput } from "@/components/ui/inputs/numberInput";
import {
  Cash_icon,
  Edit_icon,
  SaleTag_Icon,
} from "@/components/icons/iconPack";
import { VehicleInfo_T } from "@/types/vehicles";
import { TextInput } from "@/components/ui/inputs/textInput";
import {
  useUpdateOwnership,
  useUpdateSaleStatus,
} from "@/utils/apiHooks/useOwnership";
import { UpdateOwnership_T, UpdateSaleStatus_T } from "@/types/ownership";
import { GetCurrentActiveWallet } from "@/utils/web3/_connection";

export default function VehiclePage(props: { className?: string }) {
  const { className } = props;
  const { data: vehicleList, isLoading } = useVehicleList();
  if (isLoading) return <> Loading... </>;

  if (!vehicleList?.data.length)
    return (
      <div className="w-full h-full flex items-center justify-center text-2xl font-bold opacity-20 p-20">
        No Availiable Cars
      </div>
    );

  if (vehicleList)
    return (
      <div className="p-8 rounded-2xl h-full">
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 ${className}`}
        >
          {vehicleList.data.map((v: any) => (
            <Card key={v.VehicleID} vehicleId={v.VehicleID} />
          ))}
        </div>
      </div>
    );

  return null;
}

export function VehiclesForSalePage(props: { className?: string }) {
  const { className } = props;
  const { data: vehicleList, isLoading } = useSaleVehicleList();
  if (isLoading) return <> Loading... </>;

  if (!vehicleList?.data.length)
    return (
      <div className="w-full h-full flex items-center justify-center text-2xl font-bold opacity-20 p-20">
        No Availiable Cars
      </div>
    );

  if (vehicleList)
    return (
      <div className="p-8 rounded-2xl h-full">
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 ${className}`}
        >
          {vehicleList.data.map((v: any) => (
            <Card key={v.VehicleID} vehicleId={v.VehicleID} />
          ))}
        </div>
      </div>
    );

  return null;
}

function Card(props: { vehicleId: string }) {
  const { vehicleId } = props;

  // Smart Contract
  const sc_GetVehicleInfo = VehicleRecord.use_SC_GetVehicleInfo();
  const sc_GetSaleInfo = OwnershipRecord.use_SC_GetSaleInfo();
  const sc_GetVehicleOwnership = OwnershipRecord.use_SC_GetVehicleOwnership();

  // Get login Info
  const { data: loginInfo } = useLogin();

  // Get Vehicle Info
  useEffect(() => {
    sc_GetVehicleInfo.get(vehicleId);
    sc_GetSaleInfo.get(vehicleId);
    sc_GetVehicleOwnership.get(vehicleId);
  }, [vehicleId]);

  if (!sc_GetVehicleInfo.data) return null;

  return (
    <div className="grid gap-2 p-2 rounded-xl bg-zinc-900">
      {loginInfo.data.user.userType === "LTA" && (
        <div className="flex gap-2 w-full">
          <MintOwnerShip vehicleInfo={sc_GetVehicleInfo?.data} />
        </div>
      )}

      {loginInfo.data.user.ownerId ===
        sc_GetVehicleInfo.data.currentOwnerId && (
        <div className="w-full">
          <ListForSale vehicleId={vehicleId} />
        </div>
      )}

      {loginInfo.data.user.userType === "VEHICLE_OWNER" &&
        sc_GetSaleInfo.data?.isListed &&
        sc_GetVehicleOwnership.data &&
        loginInfo.data.user.ownerId !==
          sc_GetVehicleInfo.data.currentOwnerId && (
          <div>
            <div className="flex gap-2 w-full">
              <Purchase vehicleId={vehicleId} />
            </div>

            <div className="flex gap-2 w-full">
              <TransferOwnership vehicleId={vehicleId} />
            </div>
          </div>
        )}

      <VehicleCard
        dataset={{
          image: "",
          ownerId: sc_GetVehicleInfo.data?.currentOwnerId,
          license: vehicleId,
          coeRegisterDate: `${sc_GetVehicleInfo.data?.coeStartDate}`,
          coeExpireDate: `${sc_GetVehicleInfo.data?.coeExpiryDate}`,
          manufactureYear: sc_GetVehicleInfo.data?.manufactureDate,
          manufactureCompany: sc_GetVehicleInfo.data?.manufactureCompany,
          model: sc_GetVehicleInfo.data?.modelNo,
          insurancePolicyNo: sc_GetVehicleInfo.data?.insuranceId,
        }}
      />
      {loginInfo.data.user.ownerId ===
        sc_GetVehicleInfo.data.currentOwnerId && (
        <div className="flex gap-2 w-full">
          <ClaimStatus
            insuranceId={sc_GetVehicleInfo.data?.insuranceId}
            VehicleID={vehicleId}
            OwnerID={sc_GetVehicleInfo.data?.currentOwnerId}
          />
        </div>
      )}
    </div>
  );
}

function MintOwnerShip(props: { vehicleInfo: VehicleInfo_T }) {
  const { vehicleInfo } = props;

  // Smart Contract functions
  const sc_GetVehicleOwnership = OwnershipRecord.use_SC_GetVehicleOwnership();
  const sc_RevokeOwnership = OwnershipRecord.use_SC_RevokeOwnership();
  const sc_MintVehicleOwnership = OwnershipRecord.use_SC_MintVehicleOwnership();

  const handleRevokeOwnership = () => {
    sc_RevokeOwnership.send(vehicleInfo.vehicleId);
  };

  const handleMintOwnership = () => {
    sc_MintVehicleOwnership.send({
      vehicleId: vehicleInfo.vehicleId,
      owner: vehicleInfo.currentOwnerAddress,
      coeStart: vehicleInfo.coeStartDate,
      coeExpiry: vehicleInfo.coeExpiryDate,
      tokenURI: "Vehicle Image URL",
    });
  };

  useEffect(() => {
    sc_GetVehicleOwnership.get(vehicleInfo.vehicleId);
  }, [sc_RevokeOwnership.data, sc_MintVehicleOwnership.data]);

  return (
    <div className="text-xs w-full flex p-2 gap-2 items-center justify-between  rounded-xl cursor-pointer">
      {!sc_GetVehicleOwnership.data ? (
        <ButtonOutline
          className="w-full text-xs"
          onClick={() => handleMintOwnership()}
        >
          Generate NFT token
        </ButtonOutline>
      ) : (
        <ButtonOutline
          onClick={() => handleRevokeOwnership()}
          className="w-full text-xs from-red-600! to-red-500! opacity-80"
        >
          Revoke NFT token
        </ButtonOutline>
      )}
    </div>
  );
}

function ClaimStatus(props: {
  insuranceId: any;
  VehicleID: string;
  OwnerID: string;
}) {
  const { insuranceId, VehicleID, OwnerID } = props;

  return insuranceId ? (
    <CreateClaimsPopupBtn
      vehicleId={VehicleID}
      ownerId={OwnerID}
      insuranceId={insuranceId}
    />
  ) : (
    <ButtonOutline className="from-zinc-500! to-gray-500! opacity-80 pointer-events-none w-full!">
      No Insurance
    </ButtonOutline>
  );
}

function Purchase(props: { vehicleId: string }) {
  const { vehicleId } = props;
  const [price, setPrice] = useState(1);

  // Smart Contract functions
  const sc_GetSaleInfo = OwnershipRecord.use_SC_GetSaleInfo();
  const sc_PurchaseVehicle = OwnershipRecord.use_SC_PurchaseVehicle();

  const handlePurchase = () => sc_PurchaseVehicle.send(vehicleId, price);

  useEffect(() => {
    if (vehicleId) sc_GetSaleInfo.get(vehicleId);
  }, [vehicleId]);

  if (!sc_GetSaleInfo.data?.isListed) return null;

  return (
    <div className="grid w-full">
      <div className="p-4 text-lg text-center font-bold flex justify-center gap-2 items-center">
        <SaleTag_Icon /> <span>{sc_GetSaleInfo.data.price} WEI</span>
      </div>
      <div className="text-xs w-full flex p-2 gap-2 items-center justify-between  rounded-xl cursor-pointer">
        <NumberInput
          id="Purchase Price"
          label="Purchase Price"
          size={20}
          className="w-4/5"
          onChange={(newValue) => setPrice(parseInt(newValue))}
        />
        <div onClick={() => handlePurchase()}>
          <Button className="w-32! text-xs flex items-center justify-center gap-2 py-4.5">
            <Cash_icon /> Purchase
          </Button>
        </div>
      </div>
    </div>
  );
}

function ListForSale(props: { vehicleId: string }) {
  const { vehicleId } = props;
  const [price, setPrice] = useState<number>(1);
  const [editSale, setEditSale] = useState<boolean>(false);
  const [forSale, setForSale] = useState<UpdateSaleStatus_T>();

  // APIs
  const {} = useUpdateSaleStatus(forSale);

  // Smart Contract functions
  const sc_getVehicleOwnership = OwnershipRecord.use_SC_GetVehicleOwnership();
  const sc_GetSaleInfo = OwnershipRecord.use_SC_GetSaleInfo();
  const sc_ListVehicleForSale = OwnershipRecord.use_SC_ListVehicleForSale();
  const sc_CancelSale = OwnershipRecord.use_SC_CancelSale();

  const handleListForSale = async () => {
    sc_ListVehicleForSale.send({
      vehicleId: vehicleId,
      price: price,
    });
  };

  const handleCancelSale = () => sc_CancelSale.send(vehicleId);

  useEffect(() => {
    if (vehicleId) {
      sc_getVehicleOwnership.get(vehicleId);
      sc_GetSaleInfo.get(vehicleId);
    }
  }, [vehicleId, sc_CancelSale.data, sc_ListVehicleForSale.data]);

  // Set sale status to True
  useEffect(() => {
    if (sc_ListVehicleForSale.data)
      setForSale({
        forSale: true,
        vehicleID: vehicleId,
      });
  }, [sc_ListVehicleForSale.data]);

  // Set sale status to False
  useEffect(() => {
    if (sc_CancelSale?.data)
      setForSale({
        forSale: false,
        vehicleID: vehicleId,
      });
  }, [sc_CancelSale?.data]);

  if (!sc_getVehicleOwnership.data) return null;
  return (
    <>
      {sc_GetSaleInfo?.data?.isListed && (
        <div className="flex gap-2 w-full">
          <SaleStatus
            listedPrice={sc_GetSaleInfo?.data?.price}
            handlecancleSale={handleCancelSale}
            handleEdit={() => setEditSale(!editSale)}
          />
        </div>
      )}

      {((sc_getVehicleOwnership.data && !sc_GetSaleInfo?.data?.isListed) ||
        (sc_GetSaleInfo?.data?.isListed && editSale)) && (
        <div className="text-xs w-full flex p-2 gap-2 items-center justify-between  rounded-xl cursor-pointer">
          <NumberInput
            id="Sell Price"
            label="Sell Price"
            size={20}
            className="w-4/5"
            onChange={(newValue) => setPrice(parseInt(newValue))}
          />
          <div>
            <Button
              onClick={handleListForSale}
              className="w-32! text-xs flex items-center justify-center gap-2 py-4.5"
            >
              <SaleTag_Icon /> {editSale ? "Update" : "Sell"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function SaleStatus(props: {
  listedPrice: number;
  handlecancleSale: () => void;
  handleEdit: () => void;
}) {
  const { listedPrice, handlecancleSale, handleEdit } = props;

  return (
    <div className="flex justify-between items-center w-full p-2">
      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
        <span
          className="cursor-pointer text-white"
          onClick={() => handleEdit()}
        >
          <Edit_icon />
        </span>
        Sell Price:
        <span className="font-bold text-white"> {listedPrice} </span> WEI
      </div>
      <div>
        <Button className="w-32!" onClick={() => handlecancleSale()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function TransferOwnership(props: { vehicleId: string }) {
  const { vehicleId } = props;
  const [newOwnerWallet, setNewOwnerWallet] = useState<string>("");
  const [updateOwner, setUpdateOwner] = useState<UpdateOwnership_T>();

  const { data: loginInfo } = useLogin();

  // API
  const {} = useUpdateOwnership(updateOwner);

  // Smart Contracts
  const sc_GetSaleInfo = OwnershipRecord.use_SC_GetSaleInfo();
  const sc_TansferOwnershipRecord =
    OwnershipRecord.use_SC_TansferOwnershipRecord();

  const handleTransferOwnership = () =>
    sc_TansferOwnershipRecord.send(vehicleId, newOwnerWallet);

  useEffect(() => {
    if (vehicleId) sc_GetSaleInfo.get(vehicleId);
    GetCurrentActiveWallet().then((res) => {
      setNewOwnerWallet(res);
    });
  }, [loginInfo, vehicleId]);

  useEffect(() => {
    if (sc_TansferOwnershipRecord.data)
      setUpdateOwner({
        newOwnerID: loginInfo.data.user.ownerId,
        vehicleID: vehicleId,
      });
  }, [sc_TansferOwnershipRecord.data]);

  if (!sc_GetSaleInfo.data?.isListed) return null;

  return (
    <div className="text-xs w-full flex p-2 gap-2 items-center justify-between  rounded-xl cursor-pointer">
      <TextInput
        id="New Ownership Wallet"
        label="New Ownership Wallet"
        className="mb-0!"
        defaultValue={newOwnerWallet}
        onChange={(newValue) => setNewOwnerWallet(newValue)}
      />
      <div>
        <Button
          onClick={handleTransferOwnership}
          className="w-32! text-[11px] flex items-center justify-center gap-2 py-4.5"
        >
          New Ownership
        </Button>
      </div>
    </div>
  );
}
