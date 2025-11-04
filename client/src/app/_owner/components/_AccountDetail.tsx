"use client";

import { ProfileTable } from "@/components/features/profile/profileTable";
import { useLogin } from "@/utils/apiHooks/useAuth";

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
