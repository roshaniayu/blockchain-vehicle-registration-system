"use client";

import { useQuery } from "@tanstack/react-query";

// Helpers
import { fetchGet } from "@/helpers/Apis";

// Types
import { UserInfo_T, UserList_T } from "@/types/owner";

export function useGetAllUsers() {
  return useQuery<{ data: UserList_T[] }, Error>({
    queryKey: ["/users"],
    queryFn: () => fetchGet(process.env.NEXT_PUBLIC_API_URL + `users/`),
    retry: 0,
    enabled: true,
  });
}

export function useAccountActivate(id?: string) {
  return useQuery({
    queryKey: ["/users/activate", id],
    queryFn: () =>
      id
        ? fetchGet(process.env.NEXT_PUBLIC_API_URL + `users/activate/${id}`)
        : null,
    retry: 0,
    enabled: true,
  });
}

export function useGetUserByID(id?: string) {
  return useQuery<{ data: UserInfo_T } | null, Error>({
    queryKey: ["/owners", id],
    queryFn: () =>
      id ? fetchGet(process.env.NEXT_PUBLIC_API_URL + `owners/${id}`) : null,
    retry: 0,
    enabled: true,
  });
}
