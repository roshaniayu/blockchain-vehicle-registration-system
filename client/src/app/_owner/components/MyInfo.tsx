"use client";

import { useLogin } from "@/utils/apiHooks/useAuth";
import { useVehicleOwnerInfo } from "@/utils/apiHooks/useVehicle";
import { useEffect } from "react";

// Components
import PersonalDetail from "./_PersonalDetail";
import AccountDetail from "./_AccountDetail";
import LicenseInformation from "./_LicenseDetail";

export function MyInfo() {
  const { data: userInfo } = useLogin();
  const { data: vehicleOwnerInfo, refetch: refetchVOwnerInfo } =
    useVehicleOwnerInfo(userInfo.data.user.ownerId);

  useEffect(() => {
    refetchVOwnerInfo();
  }, [userInfo.data.user.ownerId]);

  return (
    <div className=" p-8 bg-black/50 rounded-2xl h-full">
      <AccountDetail info={userInfo.data.user} />

      <PersonalDetail info={vehicleOwnerInfo?.data} />
    </div>
  );
}
