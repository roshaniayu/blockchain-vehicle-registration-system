"use client";

import _, { upperCase } from "lodash";
import { useEffect, useState } from "react";

// Components
import { ButtonOutline } from "@/components/ui/buttons/buttons";
import { SearchInput } from "@/components/ui/inputs/SearchInput";
import { Wallet_Icon } from "@/components/icons/iconPack";

// Constant
import { UserAccountTypes } from "@/helpers/constants";

// API Hooks
import { useAccountActivate, useGetAllUsers } from "@/utils/apiHooks/useUsers";

// Smart Contracts
import * as UserIdentity from "@/utils/web3/UserIdentity";
import { UserType_T } from "@/types/auth";

export function AllUserListTable() {
  const [activateID, setActivateID] = useState("");
  const [keyword, setKeyword] = useState("");

  // Smart Contracts
  const sc_AddUser = UserIdentity.useSC_AddUser();

  // REST APIs
  const {
    isLoading,
    refetch: refetchUsersList,
    data: users,
  } = useGetAllUsers();

  const { data: AccActivate } = useAccountActivate(activateID);

  // Store into Blockchain
  const handleActivate = async (
    id: string,
    WalletAddress: string,
    UserType: string
  ) => {
    sc_AddUser.send({
      Address: WalletAddress,
      UserName: id,
      UserType: UserType as UserType_T,
    });
  };

  // Change activate status
  useEffect(() => {
    if (sc_AddUser.data) setActivateID(sc_AddUser.data);
  }, [sc_AddUser.data]);

  // Refresh user List
  useEffect(() => {
    refetchUsersList();
  }, [AccActivate]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex w-full items-center justify-between mb-4 ">
        <div className="text-xl font-bold"> All User Accounts </div>
        <SearchInput
          label="Search Username "
          placeholder="Search Username"
          className="mr-2"
          onChange={(newValue: string) => setKeyword(newValue)}
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-y-auto h-full rounded-2xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-400">
            <thead className="text-md  uppercase text-white font-bold">
              <tr>
                <th
                  scope="col"
                  className="p-6 tracking-wider sticky top-0 bg-zinc-400/50 backdrop-blur-xl"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="p-6 tracking-wider sticky top-0 bg-zinc-400/50 backdrop-blur-xl"
                >
                  User Type
                </th>
                <th
                  scope="col"
                  className="p-6 tracking-wider sticky top-0 bg-zinc-400/50 backdrop-blur-xl"
                >
                  Wallet
                </th>
                <th
                  scope="col"
                  className="p-6 tracking-wider sticky top-0 bg-zinc-400/50 backdrop-blur-xl"
                >
                  Created Date
                </th>
                <th
                  scope="col"
                  className="p-6 tracking-wider sticky top-0 bg-zinc-400/50 backdrop-blur-xl"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {_.filter(users?.data, (usr) =>
                upperCase(usr.Username).includes(upperCase(keyword))
              ).map((ds) => (
                <tr
                  key={ds.ID}
                  className="bg-zinc-900 border-b border-zinc-800
                hover:bg-zinc-800"
                >
                  <td className="px-6 py-4">
                    {ds.Username}
                    <p className="text-xs text-zinc-500">
                      {ds.OwnerID ? `OwnerID: ${ds.OwnerID}` : ""}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {UserAccountTypes[
                      `${ds.UserType as keyof typeof UserAccountTypes}`
                    ] ?? <span className="opacity-10 m-auto"> N/A </span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {ds.WalletAddress ? (
                      <div className="flex items-center gap-2">
                        <Wallet_Icon /> {ds.WalletAddress}
                      </div>
                    ) : (
                      <span className="opacity-10 m-auto"> N/A </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{ds.CreatedDate}</td>
                  <td className="px-6 py-4 text-center">
                    {ds.Activate ? (
                      <div className=" from-zinc-800 to-zinc-700 opacity-35 text-[9px] font-normal">
                        In Blockchain
                      </div>
                    ) : (
                      <ButtonOutline
                        onClick={() =>
                          handleActivate(
                            ds.OwnerID ?? ds.ID,
                            ds.WalletAddress,
                            ds.UserType
                          )
                        }
                      >
                        Activate
                      </ButtonOutline>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
