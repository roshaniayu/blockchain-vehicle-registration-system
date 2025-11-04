"use client";

import { useState } from "react";

// Components

import { FormCreateVechicle } from "./formCreateVechicle";
import { Button } from "@/components/ui/buttons/buttons";
import { StaticPopup } from "@/components/ui/popup/staticPopup";

export function CreateNewVehicleBtn() {
  // React States
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <Button
        className="flex items-center gap-2 text-white focus:outline-none
            ring-2 ring-zinc-700
            font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all
            opacity-80 hover:opacity-100 w-full! justify-center from-violet-800/1 to-orange-800/1 h-[100px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span> Create New Vechicle </span>
      </Button>

      {isOpen && (
        <StaticPopup
          title="Create New Vehicles"
          closeHandler={() => setIsOpen(false)}
        >
          <FormCreateVechicle />
        </StaticPopup>
      )}
    </div>
  );
}
