"use client";

import { useEffect } from "react";

// API hooks
import { useLogin } from "@/utils/apiHooks/useAuth";
import { useVehicleOwnerInfo } from "@/utils/apiHooks/useVehicle";

// Components
import PersonalDetail from "./_PersonalDetail";
import AccountDetail from "./_AccountDetail";

export function MyInfo() {
  // REST API
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
