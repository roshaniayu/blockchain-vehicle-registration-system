export interface MintVehicleOwnership_T {
  vehicleId: string;
  owner: string;
  coeStart: number;
  coeExpiry: number;
  tokenURI: string;
}

export interface ListVehicleForSale_T {
  vehicleId: string;
  price: number;
}

export interface SaleInfo_T {
  isListed: boolean;
  price: number;
}

export interface UpdateSaleStatus_T {
  vehicleID: string;
  forSale: boolean;
}

export interface UpdateOwnership_T {
  vehicleID: string;
  newOwnerID: string;
}
