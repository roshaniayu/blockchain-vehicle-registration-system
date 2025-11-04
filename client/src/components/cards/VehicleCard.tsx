"use client";

// Components
import { OwnerIdToName } from "../features/ownerIdToName";

export function VehicleCard(props: {
  dataset: {
    ownerId: string;
    license: string;
    image?: string;
    coeRegisterDate: string;
    coeExpireDate: string;
    manufactureYear: number;
    manufactureCompany: string;
    model: string;
    insurancePolicyNo: string;
  };
}) {
  const {
    ownerId,
    license,
    image,
    coeRegisterDate,
    coeExpireDate,
    manufactureYear,
    manufactureCompany,
    model,
    insurancePolicyNo,
  } = props.dataset;

  return (
    <div className="w-full border-gray-200 rounded-lg shadow-sm bg-black">
      <div className="p-5">
        <div className="rounded-xl text-center mb-2 text-xs opacity-50 px-4 py-2  bg-zinc-800 flex justify-center gap-2">
          Current Owner: <OwnerIdToName ownerID={ownerId} />
        </div>
        <div className="grid grid-cols-5">
          <div className="col-span-3">
            <div className="text-xs opacity-50">
              {manufactureCompany} {`(Year: ${manufactureYear})`}
            </div>
            <div className="text-xl">{model}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs opacity-50">License</div>
            <div className="text-xl">{license}</div>
          </div>
        </div>

        <div className="grid grid-cols-5 border-t-[1px] border-zinc-800 mt-2 py-2">
          <div className="col-span-3">
            <div className="text-xs opacity-50">COE Register Date</div>
            <div className="text-xs">{coeRegisterDate}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs opacity-50">COE Expire Date</div>
            <div className="text-xs">{coeExpireDate}</div>
          </div>
        </div>

        <div className="rounded-xl mt-4 mb-2 text-xs opacity-50">
          Insurance Policy No: <span>{insurancePolicyNo}</span>
        </div>
      </div>
    </div>
  );
}
