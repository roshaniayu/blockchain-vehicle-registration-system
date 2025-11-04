"use client";

import { useGetUserByID } from "@/utils/apiHooks/useUsers";

export function OwnerIdToName(props: { ownerID?: string }) {
  const { ownerID } = props;

  // APIs
  const { data: userInfo } = useGetUserByID(ownerID);

  return <div className="text-center"> {userInfo?.data.Name} </div>;
}
