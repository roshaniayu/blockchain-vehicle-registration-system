"use client";

import { useLogin } from "@/utils/apiHooks/useAuth";
import { notFound } from "next/navigation";

// Pages
import OwnerPage from "./_owner/page";
import InsurancePage from "./insurance/page";
import AccountsPage from "./_accounts/page";
import InsuranceListTable from "./insurance/components/policy/insurancePolicyTable";

export default function LandingPage() {
  const { data: loginInfo } = useLogin();

  if (loginInfo.data.user.userType === "LTA") return <AccountsPage />;
  if (loginInfo.data.user.userType === "VEHICLE_OWNER") return <OwnerPage />;
  if (loginInfo.data.user.userType === "INSURANCE")
    return <InsuranceListTable />;
  if (loginInfo.data.user.userType === "SPF") return <InsurancePage />;

  return notFound();
}
