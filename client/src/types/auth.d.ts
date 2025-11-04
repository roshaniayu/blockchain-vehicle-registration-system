export type RegisterInfo_T = Partial<CreateUser_T> &
  Partial<CreateVechicleOwner_T>;

export interface CreateUser_T {
  walletAddress: string;
  username: string;
  password: string;
  userType: userType;
}

export interface CreateVechicleOwner_T {
  LicenseID: string;
  Name: string;
  DOB: string;
  Nationality: string;
  PhoneNumber: number;
  Address: string;
}

export type UserType_T = "VEHICLE_OWNER" | "LTA" | "SPF" | "INSURANCE";
