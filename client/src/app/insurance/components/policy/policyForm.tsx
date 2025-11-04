"use client";

import { useEffect, useState } from "react";

// Components
import { TextInput } from "@/components/ui/inputs/textInput";
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import SelectedUserInfo from "@/components/features/profile/selectedUserInfo";

// Smart Contracts
import * as InsuranceRecord from "@/utils/web3/InsuranceRecord";
import * as VehicleRecord from "@/utils/web3/VehicleRecord";

// API Hooks
import { useGetUserByID } from "@/utils/apiHooks/useUsers";

// Helpers
import { generatePolicyId } from "@/helpers/generator";

// Types
import { PolicyInfo_T } from "@/types/insurance";

export function FormTicket() {
  // React States
  const [selectedUser, setSelectedUser] = useState<string>();
  const [inputInfo, setInputInfo] = useState<Partial<PolicyInfo_T>>({
    insuranceId: generatePolicyId(),
  });

  // REST Apis
  const { data: userInfo } = useGetUserByID(selectedUser);

  // Smart Contracts
  const sc_GetVehicleInfo = VehicleRecord.useSC_GetVehicleInfo();
  const sc_AddInsurance = InsuranceRecord.useSC_AddInsurance();

  const handlePolicyInfo = (
    key: keyof PolicyInfo_T,
    value: string | number
  ) => {
    setInputInfo(
      inputInfo ? { ...inputInfo, [`${key}`]: value } : { [`${key}`]: value }
    );
  };

  const handleSubmit = () => sc_AddInsurance.send(inputInfo);

  const handleSearchVehicle = () =>
    sc_GetVehicleInfo.get(inputInfo?.vehicleId ?? "");

  useEffect(() => {
    setSelectedUser(sc_GetVehicleInfo.data?.currentOwnerId);
  }, [sc_GetVehicleInfo.data]);

  useEffect(() => {
    setInputInfo({
      ...inputInfo,
      insurerId: userInfo?.data?.OwnerID,
      insurerAddress: userInfo?.data?.WalletAddress,
    });
  }, [userInfo?.data]);

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <TextInput
            id="ticket_insurance_Id"
            label="Insurance Id"
            defaultValue={inputInfo?.insuranceId}
            onChange={(newValue: string) =>
              handlePolicyInfo("insuranceId", newValue)
            }
          />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <div className="flex items-center gap-2">
            <TextInput
              id="ticket_vehicle_license"
              label="Vehicle License"
              onChange={(newValue: string) =>
                handlePolicyInfo("vehicleId", newValue)
              }
            />
            <div className="mb-4">
              <ButtonOutline onClick={() => handleSearchVehicle()}>
                Search
              </ButtonOutline>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <TextInput
          id="ticket_policy_type"
          label="Policy Type"
          onChange={(newValue: string) =>
            handlePolicyInfo("policyType", newValue)
          }
        />
      </div>

      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <TextInput
            id="ticket_premium_amount"
            label="Premium Amount (WEI)"
            onChange={(newValue: string) =>
              handlePolicyInfo("premiumAmount", parseInt(newValue))
            }
          />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <TextInput
            id="ticket_coverage_limit"
            label="Coverage Limit"
            onChange={(newValue: string) =>
              handlePolicyInfo("coverageLimit", parseInt(newValue))
            }
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <TextInput
            id="ticket_start_date"
            label="Start Date"
            onChange={(newValue: string) =>
              handlePolicyInfo("startDate", parseInt(newValue))
            }
          />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <TextInput
            id="ticket_end_date"
            label="End Date"
            onChange={(newValue: string) =>
              handlePolicyInfo("expiryDate", parseInt(newValue))
            }
          />
        </div>
      </div>

      {/*  <div className="grid md:gap-6 mb-8">
      <div className="relative z-0 w-full group">
            <TextInput
              id="ticket_insurer_Id"
              label="insurer Id"
              onChange={(newValue: string) =>
                handleInputInfo({ insurerId: newValue })
              }
            />
          </div>
          <div className="relative z-0 w-full group">
            <TextInput
              id="ticket_insurer_address"
              label="Insurer Address"
              onChange={(newValue: string) =>
                handleInputInfo({ insurerAddress: newValue })
              }
            />
          </div> 
      </div>*/}
      {selectedUser && <SelectedUserInfo dataset={userInfo?.data} />}
      <ButtonOutline onClick={() => handleSubmit()}>Create</ButtonOutline>
    </div>
  );
}
