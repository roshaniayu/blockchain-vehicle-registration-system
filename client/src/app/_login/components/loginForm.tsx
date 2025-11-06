"use client";

import { useState } from "react";

// Components
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import { SimpleError } from "@/components/ui/errors/simpleError";
import { PasswordInput } from "@/components/ui/inputs/passwordInput";
import { TextInput } from "@/components/ui/inputs/textInput";

// API hooks
import { useLogin } from "@/utils/apiHooks/useAuth";

interface loginInfo_T {
  username: string;
  password: string;
}

export function LoginForm(props: { registerForm: () => void }) {
  const { registerForm } = props;

  const [loginInfo, setLoginInfo] = useState<loginInfo_T>({
    username: "",
    password: "",
  });

  const { error: loginError, refetch: refetchLogin } = useLogin(loginInfo);

  const loginHandler = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    refetchLogin();
  };

  return (
    <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-black/20 border-zinc-900">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form method="POST" onSubmit={loginHandler}>
          <TextInput
            id="Email"
            label="Email"
            onChange={(newValue: string) =>
              setLoginInfo({ ...loginInfo, username: newValue })
            }
          />
          <PasswordInput
            id="password"
            label="password"
            onChange={(newValue: string) =>
              setLoginInfo({ ...loginInfo, password: newValue })
            }
          />

          <ButtonOutline className={"w-full!"} onClick={loginHandler}>
            Login
          </ButtonOutline>
        </form>

        <div className="flex gap-2 text-sm font-light text-gray-400 items-center justify-center">
          Don&apos;t have an account?
          <span
            className="font-medium text-primary-600 hover:underline text-primary-500 cursor-pointer text-blue-500"
            onClick={registerForm}
          >
            Register
          </span>
        </div>
        {loginError && loginError.toString().includes("400") && (
          <SimpleError message={`${loginError}`} />
        )}
      </div>
    </div>
  );
}
