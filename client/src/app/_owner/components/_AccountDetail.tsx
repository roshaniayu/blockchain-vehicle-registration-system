"use client";

// Components
import { ProfileTable } from "@/components/features/profile/profileTable";

export default function AccountDetail(props: { info: Record<string, string> }) {
  const { info } = props;

  return (
    <ProfileTable
      mainTitle="Account Information"
      dataset={[
        {
          title: "Username",
          value: `${info.username}`,
        },
        {
          title: "Account Type",
          value: `${info.userType}`,
        },
      ]}
    />
  );
}
