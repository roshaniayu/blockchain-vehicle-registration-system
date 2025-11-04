"use client";

export default function SelectedVehicleInfo(props: {
  vehicleId: string;
  insuranceId: string;
}) {
  const { vehicleId, insuranceId } = props;

  if (!vehicleId || !insuranceId) return null;

  return (
    <div className="bg-black/30 p-4 pb-12 mb-8 rounded-xl">
      <h1 className="font-bold my-4 text-gray-400">Vehicle Information</h1>
      <div className="gap-4 text-gray-400 text-[14px]">
        <div className="relative mt-4 flex gap-2 z-0 w-full group">
          ID:
          <span className="text-gray-100 font-bold">{vehicleId ?? "N/A"}</span>
        </div>

        <div className="relative mt-4 flex gap-2 z-0 w-full group">
          Insurance:
          <span className="text-gray-100 font-bold">
            {insuranceId ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
