"use client";

import React, { useState, useEffect } from "react";

// API hooks
import { useContractError } from "@/utils/apiHooks/useError";

export function SmartContractError() {
  const { errorContract, setErrorContract } = useContractError();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (errorContract !== null) setIsVisible(true);

    // Set a timeout to hide the message after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setErrorContract(null);
    }, 5000);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, [errorContract]); // Re-run effect if the message changes

  if (!isVisible) return null;
  return (
    <div className={`fixed bottom-2 right-0 backdrop-blur-2xl z-80! pr-4`}>
      <div
        className="border-l-2 text-red-500/50 py-2 pl-4  
      font-normal max-w-sm text-xs"
      >
        <p>{errorContract?.toString()}</p>
      </div>
    </div>
  );
}
