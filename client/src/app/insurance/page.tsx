"use client";

// Components
import { InsuranceClaimListTable } from "./components/claims/insuranceClaimsTable";

export default function InsurancePage() {
  return (
    <div className="p-8 rounded-2xl h-full">
      <InsuranceClaimListTable />
    </div>
  );
}
