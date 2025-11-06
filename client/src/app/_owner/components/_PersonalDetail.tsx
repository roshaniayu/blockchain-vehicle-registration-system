"use client";

// Components
import { ProfileTable } from "@/components/features/profile/profileTable";

export default function PersonalDetail(props: {
  info: Record<string, string>;
}) {
  const { info } = props;

  if (!info) return null;

  return (
    <ProfileTable
      mainTitle="Personal Detail"
      dataset={[
        {
          title: "Full Name",
          value: `${info.Name}`,
        },
        {
          title: "License ID",
          value: info.LicenseID,
        },
        {
          title: "Phone Number",
          value: `${info.PhoneNumber}`,
        },
        {
          title: "Address",
          value: `${info.Address}`,
        },
        {
          title: "Date of Birth",
          value: `${info.DOB}`,
        },
        {
          title: "Nationality",
          value: `${info.Nationality}`,
        },
      ]}
    />
  );
}
