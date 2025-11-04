export interface UserList_T {
  Activate: boolean;
  CreatedDate: string;
  ID: string;
  OwnerID: string;
  UserType: string;
  Username: string;
  WalletAddress: string;
}

export interface UserInfo_T {
  OwnerID: string;
  LicenseID: string;
  Name: string;
  DOB: string;
  Nationality: string;
  Address: string;
  WalletAddress: string;
  PhoneNumber: number;
}

export interface AddUser_T {
  Address: string;
  UserName: string;
  UserType: "VEHICLE_OWNER" | "LTA" | "SPF" | "INSURANCE";
}

export interface SC_userInfo_T {
  userAddress: string;
  username: string;
}
