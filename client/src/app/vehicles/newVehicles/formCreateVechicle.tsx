"use client";

import { useEffect, useState } from "react";
import _ from "lodash";

// Components
import { TextInput } from "@/components/ui/inputs/textInput";
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import { Dropdown } from "@/components/ui/inputs/dropdown";
import SelectedUserInfo from "@/components/features/profile/selectedUserInfo";

// Web3
import * as VehicleRecord from "@/utils/web3/VehicleRecord";
import * as UserIdentity from "@/utils/web3/UserIdentity";

// API Hooks
import { useVehicleCreate } from "@/utils/apiHooks/useVehicle";
import { useGetUserByID } from "@/utils/apiHooks/useUsers";

// Helpers
import { shortenString } from "@/helpers/converts";

// Types
import { UserType_T } from "@/types/auth";
import { AddNewVehicle_T } from "@/types/vehicles";

export function FormCreateVechicle() {
  // React States
  const [selectedUser, setSelectedUser] = useState<string>();
  const [inputInfo, setInputInfo] = useState<Partial<AddNewVehicle_T>>();

  // REST APIs
  const { data: userInfo } = useGetUserByID(selectedUser);
  const { refetch } = useVehicleCreate({
    vehicleID: inputInfo?.vehicleId,
    ownerID: inputInfo?.ownerId,
  });

  // Smart Contracts
  const sc_GetAllUsers = UserIdentity.useSC_GetAllUsersByTypes();

  const handleNewVehicleInfo = (
    key: keyof AddNewVehicle_T,
    value: string | number
  ) => {
    setInputInfo(
      inputInfo ? { ...inputInfo, [`${key}`]: value } : { [`${key}`]: value }
    );
  };

  const handleSubmit = async () => {
    await VehicleRecord.AddVehicle(inputInfo as AddNewVehicle_T);
    refetch();
  };

  const handleSelectUser = async (userID: string) => {
    setSelectedUser(userID);
  };

  useEffect(() => {
    setInputInfo({
      ...inputInfo,
      ownerId: userInfo?.data?.OwnerID,
      ownerAddress: userInfo?.data?.WalletAddress,
    });
  }, [userInfo?.data]);

  useEffect(() => {
    sc_GetAllUsers.get("VEHICLE_OWNER" as UserType_T);
  }, []);

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="p-4">
        <h1 className="font-bold my-4"> Vehicle Information </h1>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full group">
            <TextInput
              id="new-vehicle-license"
              label="Vehicle License No."
              onChange={(newValue: string) =>
                handleNewVehicleInfo("vehicleId", newValue)
              }
            />
          </div>
          <div className="relative z-0 w-full group">
            <TextInput
              id="new-model"
              label="Model"
              onChange={(newValue: string) =>
                handleNewVehicleInfo("modelNo", newValue)
              }
            />
          </div>
          <div className="relative z-0 w-full group">
            <TextInput
              id="new-manufacture-company"
              label="Manufacture Company"
              onChange={(newValue: string) =>
                handleNewVehicleInfo("company", newValue)
              }
            />
          </div>
          <div className="relative z-0 w-full group">
            <TextInput
              id="new-manufacture-year"
              label="Manufacture Year"
              onChange={(newValue: string) =>
                handleNewVehicleInfo("manufactureDate", parseInt(newValue))
              }
            />
          </div>
          <div className="relative z-0 w-full group">
            <TextInput
              id="new-coe-issued-date"
              label="COE Issued Date"
              onChange={(newValue: string) =>
                handleNewVehicleInfo("coeStartDate", parseInt(newValue))
              }
            />
          </div>
          <div className="relative z-0 w-full group">
            <TextInput
              id="new-coe-expire-date"
              label="COE expire Date"
              onChange={(newValue: string) =>
                handleNewVehicleInfo("coeExpiryDate", parseInt(newValue))
              }
            />
          </div>
        </div>
        <div className=" z-0 w-full group my-8">
          <Dropdown
            label="Users List"
            selected={shortenString(selectedUser ?? "")}
            onChange={(newValue: string) => handleSelectUser(newValue)}
            optionsList={sc_GetAllUsers.data?.map((ol) => ol.username) ?? []}
          />
        </div>
      </div>

      {selectedUser && <SelectedUserInfo dataset={userInfo?.data} />}

      {/* <div className="relative z-0 w-full mb-5 group">
        <FileUpload id="claim-evidence-file" label="Upload Vehicle Image" />
      </div> */}
      <ButtonOutline onClick={() => handleSubmit()}>Create</ButtonOutline>
    </div>
  );
}
