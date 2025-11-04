"use client";

import { useEffect } from "react";

import { ProfileTable } from "@/components/features/profile/profileTable";
import { useLicenseInfo, useVehicleOwnerInfo } from "@/utils/apiHooks/useVehicle";

export default function LicenseInformation(props: { LicneseID: string }) {
  const { LicneseID } = props;

  const { data: vehicleOwnerInfo } = useVehicleOwnerInfo("");

  const { data: licenseInfo, refetch: refetchLicenseInfo } =
    useLicenseInfo(LicneseID);

  useEffect(() => {
    refetchLicenseInfo();
  }, [vehicleOwnerInfo?.data?.LicenseID]);

  if (!licenseInfo) return null;

  return (
    <ProfileTable
      mainTitle="License Information"
      dataset={[
        {
          title: "License ID",
          value: `${licenseInfo.data.LicenseID}`,
        },
        {
          title: "License Class",
          value: `${licenseInfo.data.LicenseClass}`,
        },
        {
          title: "Issue Date",
          value: `${licenseInfo.data.IssueDate}`,
        },
        {
          title: "Expiry Date",
          value: `${licenseInfo.data.ExpiryDate}`,
        },
      ]}
    />
  );
}
