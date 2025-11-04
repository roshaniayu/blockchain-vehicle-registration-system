"use client";

import { useState } from "react";

// Components
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import { Dropdown } from "@/components/ui/inputs/dropdown";
import { PasswordInput } from "@/components/ui/inputs/passwordInput";
import { TextInput } from "@/components/ui/inputs/textInput";
import { CurrentWalletAddress } from "@/components/features/walletAddress";

// API hook
import { useRegister } from "@/utils/apiHooks/useAuth";

// Constant
import { UserAccountTypes } from "@/helpers/constants";

// Types
import { RegisterInfo_T, UserType_T } from "@/types/auth";
import { SimpleError } from "@/components/ui/errors/simpleError";

// Web3
import * as UserIdentity from "@/utils/web3/UserIdentity";

export function RegisterForm(props: { loginForm: () => void }) {
  const { loginForm: redirectLoginForm } = props;

  const [confirmPassword, setConfirmPassowrd] = useState("");
  const [inputInfo, setInputInfo] = useState<RegisterInfo_T>({
    userType: "VEHICLE_OWNER",
  });

  // Smart Contracts
  const sc_AddUser = UserIdentity.use_SC_AddUser();

  // APIs
  const { error: registerError, refetch: refetchRegister } =
    useRegister(inputInfo);

  const handleRegisterInfo = (
    key: keyof RegisterInfo_T,
    value: string | number
  ) => {
    setInputInfo(
      inputInfo ? { ...inputInfo, [`${key}`]: value } : { [`${key}`]: value }
    );
  };

  const HandleSubmit = async () => {
    try {
      if (
        inputInfo.walletAddress &&
        inputInfo.username &&
        inputInfo.userType === "LTA"
      ) {
        sc_AddUser.send({
          Address: inputInfo.walletAddress,
          UserName: inputInfo.username,
          UserType: inputInfo.userType as UserType_T,
        });
      }
      await refetchRegister();

      redirectLoginForm(); // Redirect to login Form
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-black/20 border-zinc-900">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <div className="space-y-4 md:space-y-6">
          <CurrentWalletAddress
            onChange={(newValue: string) =>
              handleRegisterInfo("walletAddress", newValue)
            }
          />

          {inputInfo?.userType === "VEHICLE_OWNER" && (
            <div className="bg-zinc-900 p-4 rounded-xl">
              <div className="font-bold mb-2 mt-2">Personal Information</div>
              <TextInput
                id="fullname"
                label="Full Name"
                onChange={(newValue: string) =>
                  handleRegisterInfo("Name", newValue)
                }
              />

              <TextInput
                id="license-id"
                label="Driving License ID"
                onChange={(newValue: string) =>
                  handleRegisterInfo("LicenseID", newValue)
                }
              />

              <div className="grid grid-cols-2 gap-4 m-0">
                <TextInput
                  id="nationality"
                  label="Nationality"
                  onChange={(newValue: string) =>
                    handleRegisterInfo("Nationality", newValue)
                  }
                />

                <TextInput
                  id="DOB"
                  label="Date of Birth"
                  onChange={(newValue: string) =>
                    handleRegisterInfo("DOB", newValue)
                  }
                />
              </div>

              <TextInput
                id="phone"
                label="Phone"
                onChange={(newValue: string) =>
                  handleRegisterInfo("PhoneNumber", newValue)
                }
              />

              <TextInput
                id="address"
                label="Address"
                onChange={(newValue: string) =>
                  handleRegisterInfo("Address", newValue)
                }
              />
            </div>
          )}

          <Dropdown
            label="Account Type"
            onChange={(newValue: string) =>
              handleRegisterInfo("userType", newValue)
            }
            selected={inputInfo?.userType ?? ""}
            optionsList={UserAccountTypes}
          />

          <TextInput
            id="email"
            label="Email"
            onChange={(newValue: string) =>
              handleRegisterInfo("username", newValue)
            }
          />

          <PasswordInput
            id="password"
            label="password"
            onChange={(newValue: string) =>
              handleRegisterInfo("password", newValue)
            }
          />
          <PasswordInput
            id="confirm-password"
            label="Confirm password"
            onChange={(newValue: string) => setConfirmPassowrd(newValue)}
          />

          <ButtonOutline className="w-full!" onClick={() => HandleSubmit()}>
            Create new account
          </ButtonOutline>

          <p className="flex gap-2 text-sm font-light  text-gray-400">
            Already have an account?
            <span
              className="font-medium text-primary-600 hover:underline text-primary-500 cursor-pointer text-blue-500"
              onClick={redirectLoginForm}
            >
              Login here
            </span>
          </p>

          {registerError && <SimpleError message={`${registerError}`} />}
        </div>
      </div>
    </div>
  );
}
