"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Constants
import { PageNavigtionList } from "@/helpers/constants";

// Ui Components
import { CreateTicketBtn } from "../../app/tickets/components/createTicketPopupBtn";
import { CreateInsuranceBtn } from "@/app/insurance/components/policy/createPolicyBtn";
import { CreateNewVehicleBtn } from "@/app/vehicles/newVehicles/createVehiclePopupBtn";

// API Hooks
import { useLogin } from "@/utils/apiHooks/useAuth";

export function LeftNavi() {
  const pathname = usePathname();

  const { data: userinfo } = useLogin();

  return (
    <div className="py-4 h-full">
      {userinfo.data.user.userType.includes("LTA") && <CreateNewVehicleBtn />}
      {userinfo.data.user.userType.includes("SPF") && <CreateTicketBtn />}
      {userinfo.data.user.userType.includes("INSURANCE") && (
        <CreateInsuranceBtn />
      )}

      <ul className="p-4 rounded-2xl ">
        {PageNavigtionList.map((item) =>
          item.permission.includes("*") ||
          item.permission.includes(userinfo.data.user.userType) ? (
            <li key={item.key} className={`pr-4 py-2 text-white`}>
              <Link href={item.key} className="flex gap-2">
                <span
                  className={`${
                    pathname === item.key ? "text-violet-500" : ""
                  }`}
                >
                  <item.icon />
                </span>
                <span
                  className={`font-bold 
                  ${
                    pathname === item.key
                      ? "inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-orange-500"
                      : ""
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
