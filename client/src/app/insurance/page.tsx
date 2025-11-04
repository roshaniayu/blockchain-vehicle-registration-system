"use client";

// Components
import InsuranceListTable from "@/app/insurance/components/policy/insurancePolicyTable";
import { InsuranceClaimListTable } from "./components/claims/insuranceClaimsTable";
// import { InsuranceRecord } from "@/helpers/web3";
// import { useCallback, useEffect } from "react";

export default function InsurancePage() {
  return (
    <div className="p-8 rounded-2xl h-full">
      <InsuranceClaimListTable />
    </div>
  );
}
