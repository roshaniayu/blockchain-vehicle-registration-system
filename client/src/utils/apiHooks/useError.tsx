import {
  ContractContext,
  ContractContextType,
} from "@/utils/providers/contextProvider";
import { useContext } from "react";

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
