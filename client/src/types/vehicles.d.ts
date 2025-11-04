export interface VehicleInfo_T {
  accidentIds: string[];
  claimIds: string[];
  coeExpiryDate: number;
  coeStartDate: number;
  currentOwnerAddress: string;
  currentOwnerId: string;
  insuranceId: string;
  manufactureCompany: string;
  manufactureDate: number;
  modelNo: string;
  totalClaimsReceived: number;
  totalFinesPaid: number;
  vehicleId: string;
  vehicleSignature: boolean;
}

interface VehicleListItem_T {
  data: {
    VehicleID: string;
    Email: string;
    Status: boolean;
  }[];
}

export interface AddNewVehicle_T {
  coeExpiryDate: number;
  coeStartDate: number;
  manufactureDate: number;
  company: string;
  modelNo: string;
  ownerAddress: string;
  ownerId: string;
  vehicleId: string;
}
