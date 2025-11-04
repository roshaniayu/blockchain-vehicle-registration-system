"use client";

import { useQuery } from "@tanstack/react-query";

// Helpers
import { fetchGet, fetchPost } from "@/helpers/Apis";

// Types
import { RegisterInfo_T } from "@/types/auth";

export function useLogin(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["/auth/verify-token"],
    queryFn: () =>
      fetchPost(process.env.NEXT_PUBLIC_API_URL + "auth/login", params),
    retry: 0,
    enabled: false,
  });
}

export function useRegister(params?: RegisterInfo_T) {
  return useQuery({
    queryKey: ["/auth/register"],
    queryFn: () =>
      fetchPost(process.env.NEXT_PUBLIC_API_URL + "auth/register", params),
    retry: 0,
    enabled: false,
  });
}

export function useCheckToken() {
  return useQuery({
    queryKey: ["/auth/verify-token"],
    queryFn: () =>
      fetchGet(process.env.NEXT_PUBLIC_API_URL + "auth/verify-token"),
    retry: 0,
    enabled: false,
  });
}
