"use client";

import { useState } from "react";

// Components
import { FormClaims } from "./formClaims";
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import { StaticPopup } from "@/components/ui/popup/staticPopup";

export function CreateClaimsPopupBtn(props: {
  vehicleId: string;
  insuranceId: string;
  ownerId: string;
}) {
  // States
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ButtonOutline className={"w-full!"} onClick={() => setIsOpen(!isOpen)}>
        <span> Create Claims </span>
      </ButtonOutline>

      {isOpen && (
        <StaticPopup
          title="Submit Claims"
          closeHandler={() => setIsOpen(false)}
        >
          <FormClaims
            vehicleId={props.vehicleId}
            insuranceId={props.insuranceId}
            ownerId={props.ownerId}
          />
        </StaticPopup>
      )}
    </>
  );
}
