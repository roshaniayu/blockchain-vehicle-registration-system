"use client";

import SelectedVehicleInfo from "@/components/features/profile/selectedVehicleInfo";
// Components
import { Button, ButtonOutline } from "@/components/ui/buttons/buttons";
import { FileUpload } from "@/components/ui/inputs/fileUpload";
import { NumberInput } from "@/components/ui/inputs/numberInput";
import { Textarea } from "@/components/ui/inputs/textareaInput";
import { generateClaimID } from "@/helpers/generator";
import * as InsuranceRecord from "@/utils/web3/InsuranceRecord";
import { useState } from "react";

export function FormClaims(props: {
  vehicleId: string;
  insuranceId: string;
  ownerId: string;
}) {
  const [inputInfo, setInputInfo] = useState({
    claimedAmount: 0,
    claimedReason: "Test Reason",
  });

  // Smart Contracts
  const sc_RequestClaim = InsuranceRecord.use_SC_RequestClaim();

  const handleInputInfo = (newInput: Record<string, string | number>) => {
    setInputInfo({ ...inputInfo, ...newInput });
  };

  const handleSubmit = async () => {
    sc_RequestClaim.send({
      claimId: generateClaimID(),
      claimedAmount: inputInfo.claimedAmount,
      vehicleId: props.vehicleId,
      insuranceId: props.insuranceId,
      claimReason: inputInfo.claimedReason,
      ownerId: props.ownerId,
    });
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <SelectedVehicleInfo
        vehicleId={props.vehicleId}
        insuranceId={props.insuranceId}
      />
      <div className="relative z-0 w-full mb-5 group flex justify-center bg-black/25 p-4 rounded-xl">
        <NumberInput
          id="claim_amount"
          label="Amount (WEI)"
          onChange={(newValue) =>
            handleInputInfo({ ...inputInfo, claimedAmount: parseInt(newValue) })
          }
        />
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <Textarea
          id="ticket_reason"
          label="Reason"
          onChange={(newValue: string) =>
            handleInputInfo({ ...inputInfo, claimReason: newValue })
          }
        />
      </div>
      <ButtonOutline onClick={() => handleSubmit()}> Submit </ButtonOutline>
    </div>
  );
}
