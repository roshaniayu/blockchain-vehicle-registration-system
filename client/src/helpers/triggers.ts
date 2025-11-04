"use client";

import { useCallback, useEffect, useState } from "react";

// API Hooks
import { useLogin } from "@/utils/apiHooks/useAuth";

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    /** Mouse Down */
    function handleMouseDown(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as HTMLInputElement)
      )
        callback();
    }

    /** Keydown Trigger */
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") callback();
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleEscapeKey);

    // Unbind the event listener on clean up
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [ref, callback]);
}

export function useCurrentWallet() {
  const [data, setData] = useState<string | null>(null);

  const handleDefaultWallet = useCallback(async () => {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    setData(accounts[0]);
  }, []);

  const handleWalletChange = useCallback(async (WalletList: string[]) => {
    setData(WalletList[0]);
  }, []);

  useEffect(() => {
    if (typeof (window as any).ethereum !== "undefined") {
      handleDefaultWallet();
      (window as any).ethereum.on("accountsChanged", handleWalletChange);
    }
  }, []);

  return { data };
}

export function getToken() {
  const { data: loginInfo } = useLogin();

  return (loginInfo?.data?.token as string) ?? "";
}
