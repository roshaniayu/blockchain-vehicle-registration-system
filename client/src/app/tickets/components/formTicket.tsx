"use client";

import { useEffect, useState } from "react";

// Components
import { Textarea } from "@/components/ui/inputs/textareaInput";
import { TextInput } from "@/components/ui/inputs/textInput";
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import SelectedUserInfo from "@/components/features/profile/selectedUserInfo";

// APIs
import { useGetUserByID } from "@/utils/apiHooks/useUsers";

// Smart Contracts
import * as TrafficRecord from "@/utils/web3/TrafficRecord";
import * as VehicleRecord from "@/utils/web3/VehicleRecord";

// Helper
import { generateTrafficTicketID } from "@/helpers/generator";

// Types
import { TicketForm_T } from "@/types/tickets";

export function FormTicket() {
  // React States
  const [selectedUser, setSelectedUser] = useState<string>();
  const [inputInfo, setInputInfo] = useState<Partial<TicketForm_T>>({
    violationId: generateTrafficTicketID(),
  });

  // APIs
  const { data: userInfo } = useGetUserByID(selectedUser);

  // Smart Contracts
  const sc_GetVehicleInfo = VehicleRecord.use_SC_GetVehicleInfo();
  const sc_RecordViolation = TrafficRecord.use_SC_RecordViolation();

  const handlePolicyInfo = (
    key: keyof TicketForm_T,
    value: string | number
  ) => {
    setInputInfo(
      inputInfo ? { ...inputInfo, [`${key}`]: value } : { [`${key}`]: value }
    );
  };
  const handleSubmit = () => sc_RecordViolation.send(inputInfo);

  const handleSearchVehicle = () =>
    sc_GetVehicleInfo.get(inputInfo?.vehicleId ?? "");

  useEffect(() => {
    setSelectedUser(sc_GetVehicleInfo.data?.currentOwnerId);
  }, [sc_GetVehicleInfo.data]);

  return (
    <div className="max-w-md mx-auto p-8">
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <TextInput
            id="ticket_violation_Id"
            label="Violation Id"
            defaultValue={inputInfo.violationId}
            onChange={(newValue: string) =>
              handlePolicyInfo("violationId", newValue)
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
          id="ticket_amount"
          label="Amount (WEI)"
          onChange={(newValue: string) =>
            handlePolicyInfo("amount", parseInt(newValue))
          }
        />
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <Textarea
          id="ticket_reason"
          label="Reason"
          onChange={(newValue: string) => handlePolicyInfo("reason", newValue)}
        />
      </div>

      {selectedUser && <SelectedUserInfo dataset={userInfo?.data} />}
      <ButtonOutline onClick={() => handleSubmit()}>Create</ButtonOutline>
    </div>
  );
}
