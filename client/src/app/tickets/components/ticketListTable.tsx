"use client";

import { useEffect, useState } from "react";
import _, { upperCase } from "lodash";

// Components
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import { SearchInput } from "@/components/ui/inputs/SearchInput";
import { OwnerIdToName } from "@/components/features/ownerIdToName";

// API Hooks
import { useVehicleList } from "@/utils/apiHooks/useVehicle";
import { useLogin } from "@/utils/apiHooks/useAuth";

// Web3
import * as TrafficRecord from "@/utils/web3/TrafficRecord";
import * as VehicleRecord from "@/utils/web3/VehicleRecord";

// Icons
import {
  Check_Icon,
  Eye_Icon,
  Ticket_icon,
  Warning_Icon,
} from "@/components/icons/iconPack";

// Types
import { VehicleInfo_T } from "@/types/vehicles";

const tableColumns: {
  title: string;
  className?: string;
}[] = [
  { title: "" },
  { title: "Ticket ID" },
  { title: "Vehicle Name" },
  { title: "Vehicle License", className: "text-center" },
  { title: "Status", className: "text-center" },
  { title: "Payable Amount", className: "text-center" },
  { title: " Owner Email", className: "text-center" },
  { title: "" },
];

export function TicketListTable() {
  const [keyword, setKeyword] = useState("");

  // API Hooks
  const { data: vehicleList, isLoading } = useVehicleList();

  if (isLoading) return <> Loading... </>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
      <div className="flex w-full items-center justify-between mb-4">
        <div className="text-xl font-bold"> Traffic Records List </div>
        <SearchInput
          onChange={(newValue: string) => setKeyword(newValue)}
          label="Search Vehicle License"
          placeholder="Search Vehicle License"
          className="mb-4! mr-2"
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-400 rounded-lg overflow-hidden">
        <thead className="text-md  uppercase text-white font-bold ">
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
  );
}

function RowTemplate(props: { vehicleId: string }) {
  const { vehicleId } = props;

  // Smart Contract
  const sc_GetVehicleInfo = VehicleRecord.useSC_GetVehicleInfo();

  useEffect(() => {
    sc_GetVehicleInfo.get(vehicleId); // Get Vehicle Info from smart contracts
  }, [vehicleId]);

  if (!sc_GetVehicleInfo.data) return null;

  return (
    <>
      {sc_GetVehicleInfo.data.accidentIds.map((tk: string, idx: number) => (
        <TicketInfo
          key={tk + idx}
          accidentId={tk}
          vehicleInfo={sc_GetVehicleInfo.data}
        />
      ))}
    </>
  );
}

export function TicketInfo(props: {
  accidentId: string;
  vehicleInfo?: VehicleInfo_T | null;
}) {
  const { accidentId, vehicleInfo } = props;

  // Get login Info
  const { data: loginInfo } = useLogin();

  // Smart Contracts
  const sc_GetTicketInfo = TrafficRecord.useSC_GetTicketInfo();
  const sc_PayFine = TrafficRecord.useSC_PayFine();

  const handlePayFine = async (violationId: string, amount: number) =>
    sc_PayFine.send(violationId, amount.toString());

  // Get Ticket Info
  useEffect(() => {
    sc_GetTicketInfo.get(accidentId);
  }, [accidentId]);

  // Re-render the table list after "Pay Fine"
  useEffect(() => {
    sc_GetTicketInfo.get(accidentId);
  }, [sc_PayFine.data]);

  if (!sc_GetTicketInfo.data || !vehicleInfo) return null;

  return (
    <tr
      key={sc_GetTicketInfo.data.violationId}
      className="bg-zinc-900 border-b  border-zinc-800
                 border-gray-20 hover:bg-zinc-800"
    >
      <td className="px-6 py-4">
        <Eye_Icon />
      </td>
      <td className="px-6 py-4">
        <span className="flex items-center gap-2">
          <Ticket_icon />
          {sc_GetTicketInfo.data.violationId}
        </span>
      </td>
      <th
        scope="row"
        className="flex items-center px-6 py-4 whitespace-nowrap text-white"
      >
        <div className="ps-3 w-full">
          <div className="text-base font-semibold">
            {vehicleInfo.manufactureCompany}
          </div>
          <div className="font-normal text-gray-500">{vehicleInfo.modelNo}</div>
        </div>
      </th>
      <td className="px-6 py-4 text-center">{vehicleInfo.vehicleId}</td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {sc_GetTicketInfo.data.paid ? (
            <span className="text-green-300 flex gap-2 items-center">
              <Check_Icon />
              Paid
            </span>
          ) : (
            <span className="text-orange-300 flex gap-2 items-center">
              <Warning_Icon /> Pending
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center">
          {sc_GetTicketInfo.data.amount} WEI
        </div>
      </td>
      <td className="px-6 py-4">
        <OwnerIdToName ownerID={vehicleInfo.currentOwnerId} />
      </td>

      <td className="px-6 py-4">
        {!sc_GetTicketInfo.data.paid &&
          loginInfo.data.user.userType === "VEHICLE_OWNER" && (
            <ButtonOutline
              onClick={() =>
                handlePayFine(
                  sc_GetTicketInfo?.data?.violationId ?? "",
                  sc_GetTicketInfo?.data?.amount ?? 0
                )
              }
            >
              Pay Fine
            </ButtonOutline>
          )}
      </td>
    </tr>
  );
}
