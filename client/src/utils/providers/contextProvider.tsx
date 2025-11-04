import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export interface ContractContextType {
  errorContract: string | null;
  setErrorContract: Dispatch<SetStateAction<string | null>>;
}

// 2. Create the context.
// We use 'undefined' as the default value to signify that the context hasn't been used within a Provider yet.
// We assert the type using 'as ContractContextType | undefined'.
export const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

// 3. The provider component remains largely the same, but now uses the defined types.
export const SmartContractErrorProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [errorContract, setErrorContract] = useState<string | null>(null);

  // Create the value object which correctly implements ContractContextType
  const value = { errorContract, setErrorContract };

  // The value prop passes the state and the setter function
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
