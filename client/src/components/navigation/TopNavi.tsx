"use client";

// Components
import { UserInfo } from "../features/profile/userInfo";
import { CurrentWalletAddress } from "../features/walletAddress";

// Icons
import { LogoIcon } from "../icons/logo";

export function TopNavi() {
  return (
    <section className="h-16">
      <div className="flex justify-between items-start">
        <LogoIcon width={200} height={200} />
        <CurrentWalletAddress className={"mb-0!"} />
        <div className="flex gap-2 items-center">
          <UserInfo />
        </div>
      </div>
    </section>
  );
}
