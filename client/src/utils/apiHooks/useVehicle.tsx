"use client";

import { fetchGet, fetchPost } from "@/helpers/Apis";
import { AddNewVehicle_T, VehicleListItem_T } from "@/types/vehicles";
import { useQuery } from "@tanstack/react-query";
import { useLogin } from "./useAuth";

export function useVehicleOwnerInfo(ownerId: string) {
  return useQuery({
    queryKey: ["/owners", ownerId],
    queryFn: () =>
      fetchGet(process.env.NEXT_PUBLIC_API_URL + `owners/${ownerId}`),
    retry: 0,
    enabled: false,
  });
}

export function useLicenseInfo(licenseId: string) {
  return useQuery({
    queryKey: ["/license", licenseId],
    queryFn: () =>
      fetchGet(process.env.NEXT_PUBLIC_API_URL + `licenses/${licenseId}`),
    retry: 0,
    enabled: false,
  });
}

export function useVehicleCreate(params: {
  vehicleID?: AddNewVehicle_T["vehicleId"];
  ownerID?: AddNewVehicle_T["ownerId"];
}) {
  return useQuery({
    queryKey: ["/vehicles/add", params],
    queryFn: () =>
      params.vehicleID && params.ownerID
        ? fetchPost(process.env.NEXT_PUBLIC_API_URL + `vehicles/add`, params)
        : null,
    retry: 0,
    enabled: false,
  });
}

export function useVehicleList() {
  const { data: loginUser } = useLogin();
  const loginUserID = loginUser.data.user.ownerId ?? "";
  return useQuery<VehicleListItem_T, Error>({
    queryKey: ["/vehicles/", loginUserID ?? ""],
    queryFn: () =>
      fetchGet(
        process.env.NEXT_PUBLIC_API_URL + `vehicles/${loginUserID ?? ""}`
      ),
    retry: 0,
    enabled: true,
  });
}

export function useSaleVehicleList() {
  const { data: loginUser } = useLogin();
  const loginUserID = loginUser.data.user.ownerId ?? "";
  return useQuery<VehicleListItem_T, Error>({
    queryKey: ["/vehicles/salelist/", loginUserID ?? ""],
    queryFn: () =>
      fetchGet(
        process.env.NEXT_PUBLIC_API_URL +
          `vehicles/salelist/${loginUserID ?? ""}`
      ),
    retry: 0,
    enabled: true,
  });
}
