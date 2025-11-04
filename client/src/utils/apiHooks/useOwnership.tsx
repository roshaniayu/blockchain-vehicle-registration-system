"use client";

import { fetchPost } from "@/helpers/Apis";
import { UpdateOwnership_T, UpdateSaleStatus_T } from "@/types/ownership";
import { useQuery } from "@tanstack/react-query";

export function useUpdateSaleStatus(params?: UpdateSaleStatus_T) {
  return useQuery({
    queryKey: ["/vehicles/salestatus/", params],
    queryFn: () =>
      params && params.forSale !== null && params.vehicleID
        ? fetchPost(
            process.env.NEXT_PUBLIC_API_URL + `vehicles/salestatus`,
            params
          )
        : null,
    retry: 0,
    enabled: true,
  });
}

export function useUpdateOwnership(params?: UpdateOwnership_T) {
  return useQuery({
    queryKey: ["/vehicles/transfer/", params],
    queryFn: () =>
      params && params?.newOwnerID && params?.vehicleID
        ? fetchPost(
            process.env.NEXT_PUBLIC_API_URL + `vehicles/transfer`,
            params
          )
        : null,
    retry: 0,
    enabled: true,
  });
}
