"use client";

// Components
import { SearchInput } from "@/components/ui/inputs/SearchInput";
import { useVehicleList } from "@/utils/apiHooks/useVehicle";
import { useCallback, useEffect, useState } from "react";

// Smart Contracts
import * as InsuranceRecords from "@/utils/web3/InsuranceRecord";
import * as VehicleRecord from "@/utils/web3/VehicleRecord";
import { shortenString } from "@/helpers/converts";
import _, { upperCase } from "lodash";
import { OwnerIdToName } from "@/components/features/ownerIdToName";
import { useLogin } from "@/utils/apiHooks/useAuth";

const tableColumns: {
  title: string;
  className?: string;
}[] = [
  { title: "Insurance ID" },
  { title: "Status" },
  { title: "Policy Type" },
  { title: "Premium Amount" },
  { title: "Coverage Limit" },
  { title: "Policy Start Date" },
  { title: "Policy End Date" },
  { title: "Insurer ID" },
  { title: "Insurer Wallet Address" },
  { title: "Vehicle License" },
  { title: "Vehicle model" },
];

export default function InsuranceListTable() {
  const [keyword, setKeyword] = useState("");

  // APIs
  const { data: vehicleList, isLoading } = useVehicleList();
  if (isLoading) return <> Loading... </>;
  return (
    <div className=" p-8">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex w-full items-center justify-between mb-4">
          <div className="text-xl font-bold"> Insurance Policy List </div>
          <SearchInput
            label="Search Vehicle License"
            placeholder="Search Vehicle License"
            onChange={(newValue: string) => setKeyword(newValue)}
          />
        </div>
        <div className="w-full overflow-auto">
          <div className="min-w-7xl">
            <table className="w-full text-sm text-left rtl:text-right text-gray-400 rounded-lg overflow-hidden">
              <thead className="text-md text-white uppercase">
                <tr>
                  {tableColumns.map((col, idx) => (
                    <th
                      key={col.title + idx}
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
    </div>
  );
}

function RowTemplate(props: { vehicleId: string }) {
  const { vehicleId } = props;

  // Smart Contract
  const sc_GetVehicleInfo = VehicleRecord.use_SC_GetVehicleInfo();
  const sc_GetInsuranceInfo = InsuranceRecords.use_SC_GetInsuranceInfo();

  useEffect(() => {
    sc_GetVehicleInfo.get(vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    if (sc_GetVehicleInfo.data?.insuranceId) {
      sc_GetInsuranceInfo.get(sc_GetVehicleInfo.data?.insuranceId);
    }
  }, [sc_GetVehicleInfo.data]);

  if (!sc_GetInsuranceInfo.data || !sc_GetVehicleInfo.data) return null;

  return (
    <tr
      className="bg-zinc-900 border-b  border-zinc-800
                 border-gray-20 hover:bg-zinc-800"
    >
      <td className="px-6 py-4">{sc_GetInsuranceInfo.data.insuranceId}</td>
      <td className="px-6 py-4">
        {sc_GetInsuranceInfo.data.isActive ? "Active" : "Inactive"}
      </td>
      <td className="px-6 py-4">{sc_GetInsuranceInfo.data.policyType}</td>
      <td className="px-6 py-4">{sc_GetInsuranceInfo.data.premiumAmount}</td>
      <td className="px-6 py-4">{sc_GetInsuranceInfo.data.coverageLimit}</td>
      <td className="px-6 py-4">{sc_GetInsuranceInfo.data.policyStartDate}</td>
      <td className="px-6 py-4">{sc_GetInsuranceInfo.data.policyExpiryDate}</td>
      <td className="px-6 py-4">
        <OwnerIdToName ownerID={sc_GetInsuranceInfo.data.insurerId} />
      </td>
      <td className="px-6 py-4">
        {shortenString(sc_GetInsuranceInfo.data.insurerAddress)}
      </td>
      <td className="px-6 py-4">{sc_GetInsuranceInfo.data.vehicleId}</td>
      <td
        scope="row"
        className="flex items-center px-6 py-4 whitespace-nowrap text-white"
      >
        <div className="ps-3">
          <div className="text-base font-semibold">
            {sc_GetVehicleInfo.data.manufactureCompany}
          </div>
          <div className="font-normal text-gray-500">
            {sc_GetVehicleInfo.data.modelNo}
          </div>
        </div>
      </td>
    </tr>
  );
}
