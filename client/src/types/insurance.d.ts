export interface InsuranceInfo_T {
  coverageLimit: number;
  insuranceId: string;
  insurerAddress: string;
  insurerId: string;
  isActive: boolean;
  policyExpiryDate: number;
  policyStartDate: number;
  policyType: string;
  premiumAmount: number;
  vehicleId: string;
}

export interface ClaimInfo_T {
  approvedAmount: number;
  claimId: string;
  claimedAmount: number;
  insuranceId: string;
  isApproved: boolean;
  isSettled: boolean;
  ownerId: string;
  reason: string;
  vehicleId: string;
}

export interface PolicyInfo_T {
  insuranceId: string;
  vehicleId: string;
  insurerId: string;
  insurerAddress: string;
  policyType: string;
  premiumAmount: number;
  coverageLimit: number;
  startDate: number;
  expiryDate: number;
}

export interface ClaimForm_T {
  claimId: string;
  insuranceId: string;
  vehicleId: string;
  ownerId: string;
  claimedAmount: number;
  claimReason: string;
}
