"use client";

import { Button, ButtonOutline } from "@/components/ui/buttons/buttons";

// Components
import { SearchInput } from "@/components/ui/inputs/SearchInput";

// APIs
import { useVehicleList } from "@/utils/apiHooks/useVehicle";

// Web3
import * as VehicleRecord from "@/utils/web3/VehicleRecord";
import * as InsuranceRecord from "@/utils/web3/InsuranceRecord";
import { useCallback, useEffect, useState } from "react";
import { VehicleInfo_T } from "@/types/vehicles";
import { NumberInput } from "@/components/ui/inputs/numberInput";
import _, { upperCase } from "lodash";
import {
  Check_Icon,
  Eye_Icon,
  Thumb_Icon,
  Warning_Icon,
} from "@/components/icons/iconPack";
import { useGetUserByID } from "@/utils/apiHooks/useUsers";
import { OwnerIdToName } from "@/components/features/ownerIdToName";
import { useLogin } from "@/utils/apiHooks/useAuth";

const tableColumns: {
  title: string;
  className?: string;
}[] = [
  { title: "" },
  { title: "Claim ID" },
  { title: "Vehicle Name" },
  { title: "Vehicle License", className: "text-center" },
  { title: "Owner", className: "text-center" },
  { title: "Amount", className: "text-center" },
  { title: "Status", className: "text-center" },
  { title: "" },
];

export function InsuranceClaimListTable() {
  const [keyword, setKeyword] = useState("");

  // Fetch from DB.
  const { data: vehicleList, isLoading } = useVehicleList();

  if (isLoading) return <> Loading... </>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
      <div className="flex w-full items-center justify-between mb-4">
        <div className="text-xl font-bold"> Claim List </div>
        <SearchInput
          onChange={(newValue: string) => setKeyword(newValue)}
          label="Search Vehicle License"
          placeholder="Search Vehicle License"
          className="mb-4! mr-2"
        />
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-7xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-400 rounded-lg overflow-hidden">
            <thead className="text-md uppercase text-white font-bold ">
              <tr>
                {tableColumns.map((col, idx) => (
                  <th
                    key={idx + col.title}
                    scope="col"
                    className={`p-6 tracking-wider sticky top-0 bg-zinc-700/50 backdrop-blur-xl ${
                      col?.className ?? ""
                    }`}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {_.filter(vehicleList?.data, (vl) =>
                upperCase(vl.VehicleID).includes(upperCase(keyword))
              ).map((v) => (
                <RowTemplate key={v.VehicleID} vehicleId={v.VehicleID} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RowTemplate(props: { vehicleId: string }) {
  const { vehicleId } = props;

  // Smart Contract
  const sc_GetVehicleInfo = VehicleRecord.use_SC_GetVehicleInfo();

  // Get Vehicle Info
  useEffect(() => {
    sc_GetVehicleInfo.get(vehicleId);
  }, [vehicleId]);

  if (!sc_GetVehicleInfo.data) return null;

  return (
    <>
      {sc_GetVehicleInfo.data.claimIds.map((claim: string, idx) => (
        <TicketInfo
          key={claim + idx}
          claim={claim}
          vehicleInfo={sc_GetVehicleInfo.data}
        />
      ))}
    </>
  );
}

export function TicketInfo(props: {
  claim: string;
  vehicleInfo?: VehicleInfo_T | null;
}) {
  const { claim, vehicleInfo } = props;

  // React States
  const [approveAmount, setApproveAmount] = useState(1);

  // Get login Info
  const { data: loginInfo } = useLogin();

  // Smart contracts
  const sc_GetClaimInfo = InsuranceRecord.use_SC_GetClaimInfo();
  const sc_SettleClaim = InsuranceRecord.use_SC_SettleClaim();
  const sc_ApproveClaim = InsuranceRecord.use_SC_ApproveClaim();

  const handleSettleClaim = async (
    claimId?: string,
    amount?: string | number
  ) => {
    if (claimId && amount)
      sc_SettleClaim.send(claimId, parseInt(amount.toString()));
  };

  const handleApproveClaim = async (claimId?: string) => {
    if (claimId) sc_ApproveClaim.send(claimId, approveAmount);
  };

  // Get Ticket Info
  useEffect(() => {
    sc_GetClaimInfo.get(claim);
  }, [claim]);

  // Re-render the table list after "Pay Fine"
  useEffect(() => {
    sc_GetClaimInfo.get(claim);
  }, [sc_ApproveClaim.data, sc_SettleClaim.data]);

  if (!sc_GetClaimInfo.data || !vehicleInfo) return null;

  return (
    <tr
      key={sc_GetClaimInfo.data.claimId}
      className="bg-zinc-900 border-b  border-zinc-800
                          border-gray-20 hover:bg-zinc-800"
    >
      <td className="px-6 py-4">
        <Eye_Icon />
      </td>
      <td className="px-6 py-4 w-64">
        {sc_GetClaimInfo.data.claimId}
        <p className="text-xs text-gray-600">
          Policy ID: {sc_GetClaimInfo.data.insuranceId}{" "}
        </p>
      </td>
      <th
        scope="row"
        className="flex items-center px-3 py-4 whitespace-nowrap text-white"
      >
        <div className="ps-3 w-full">
          <div className="text-base font-semibold">
            {vehicleInfo.manufactureCompany}
          </div>
          <div className="font-normal text-gray-500">{vehicleInfo.modelNo}</div>
        </div>
      </th>
      <td className="px-6 py-4 text-center">
        {sc_GetClaimInfo.data.vehicleId}
      </td>
      <td className="px-6 py-4 text-center">
        <OwnerIdToName ownerID={vehicleInfo.currentOwnerId} />
      </td>
      <td className="px-6 py-4 text-center">
        {sc_GetClaimInfo.data.claimedAmount}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="grid justify-center">
          {!sc_GetClaimInfo.data.isApproved &&
            !sc_GetClaimInfo.data.isSettled && (
              <span className="text-orange-300 flex gap-2 items-center">
                <Warning_Icon /> Pending
              </span>
            )}

          {sc_GetClaimInfo.data.isApproved &&
            !sc_GetClaimInfo.data.isSettled && (
              <>
                <span className="text-blue-300 flex gap-2 items-center">
                  <Check_Icon />
                  Approved
                </span>
                <p>({sc_GetClaimInfo.data.approvedAmount} WEI)</p>
              </>
            )}

          {sc_GetClaimInfo.data.isSettled && (
            <>
              <span className="text-green-300 flex gap-2 items-center">
                <Thumb_Icon />
                Settled
              </span>
              <p>({sc_GetClaimInfo.data.approvedAmount} WEI)</p>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        {loginInfo.data.user.userType === "INSURANCE" && (
          <div className=" min-w-94 justify-end flex">
            {sc_GetClaimInfo.data.isApproved &&
              !sc_GetClaimInfo.data.isSettled && (
                <Button
                  onClick={() =>
                    handleSettleClaim(
                      sc_GetClaimInfo?.data?.claimId,
                      sc_GetClaimInfo?.data?.approvedAmount
                    )
                  }
                  className="font-medium pr-4 w-32!"
                >
                  Settle Claim
                </Button>
              )}

            {!sc_GetClaimInfo.data.isApproved && (
              <div className="flex justify-between gap-2 items-center">
                <NumberInput
                  id="approved_amount"
                  label="Amount (WEI)"
                  onChange={(newValue) => setApproveAmount(parseInt(newValue))}
                />
                <ButtonOutline
                  onClick={() =>
                    handleApproveClaim(sc_GetClaimInfo?.data?.claimId)
                  }
                >
                  Approve
                </ButtonOutline>
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
