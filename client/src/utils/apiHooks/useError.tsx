"use client";

import { useContext } from "react";

// Context providers
import {
  ContractContext,
  ContractContextType,
} from "@/utils/providers/contextProvider";

// Assuming SmartContractErrorProvider is in the same directory or adjust the import path

export const useContractError = (): ContractContextType => {
  const context = useContext(ContractContext);

  // Check if the hook is called outside of the Provider
  if (context === undefined) {
    throw new Error(
      "useContractError must be used within a SmartContractErrorProvider"
    );
  }

  return context;
};
