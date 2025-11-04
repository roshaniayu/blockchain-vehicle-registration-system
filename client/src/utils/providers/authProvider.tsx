"use client";

import { Fragment, useEffect, useState } from "react";

// Hooks
import { useCheckToken, useLogin } from "@/utils/apiHooks/useAuth";

// Components
import LoginPage from "@/app/_login/page";
import { LeftNavi } from "@/components/navigation/LeftNavi";
import { TopNavi } from "@/components/navigation/TopNavi";
import { SmartContractErrorProvider } from "./contextProvider";
import { SmartContractError } from "@/components/ui/errors/smartContractError";
import { PageNavigtionList } from "@/helpers/constants";
import _ from "lodash";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [token, setToken] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const { data: loginUser } = useLogin();

  const {
    error: tokenError,
    data: tokenData,
    refetch: checkTokenRefetch,
  } = useCheckToken();

  useEffect(() => {
    checkTokenRefetch();
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (tokenData?.data?.token) {
      localStorage.setItem("token", tokenData.data.token);
      setToken(localStorage.getItem("token"));
    }
  }, [tokenData]);

  useEffect(() => {
    console.log(pathname, loginUser);
    router.push("/");
    if (!pageValidation(pathname, loginUser)) {
      router.push("/");
    }
  }, [router]);

  if (tokenError)
    return (
      <SmartContractErrorProvider>
        <LoginPage />
      </SmartContractErrorProvider>
    );
  if (tokenData && token)
    return (
      <Fragment>
        <SmartContractErrorProvider>
          <TopNavi />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
              <LeftNavi />
            </div>
            <div className="col-span-10 bg-zinc-800 rounded-2xl">
              <div className="min-h-[calc(100dvh-96px)] bg-black/60">
                <SmartContractError />
                {children}
              </div>
            </div>
          </div>
        </SmartContractErrorProvider>
      </Fragment>
    );
}

function pageValidation(pathname: string, loginUser: any) {
  if (pathname === "/") return true;

  const validAccess = _.filter(PageNavigtionList, (page) => {
    if (
      page.key === pathname &&
      page.permission.includes(loginUser?.data?.user?.userType)
    )
      return true;
    return false;
  });

  return validAccess.length ? true : false;
}
