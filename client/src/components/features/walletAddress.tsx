"use client";

import { useEffect } from "react";

// Icons
import { MetaMaskIcon } from "../icons/logo";

// Helpers
import { useCurrentWallet } from "@/helpers/triggers";

export function CurrentWalletAddress(props: {
  onChange?: (newValue: string) => void;
  className?: string;
}) {
  const { onChange, className } = props;

  const { data: walletAddress } = useCurrentWallet();

  useEffect(() => {
    if (walletAddress && onChange) onChange(walletAddress);
  }, [walletAddress]);

  if (!walletAddress)
    return (
      <div className="text-red-600 px-4 py-2 text-center">
        Please install the Meta Mask.
      </div>
    );

  return (
    <div className={`relative z-0 w-full mb-5 group ${className}`}>
      <div className="px-4 py-2 text-xs text-center text-amber-700 backdrop-blur-2xl rounded-lg flex gap-4 items-center justify-center">
        <p>
          <MetaMaskIcon width={20} height={20} />
        </p>
        <p>{walletAddress}</p>
      </div>
    </div>
  );
}
