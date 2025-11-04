export interface TicketInfo_T {
  amount: number;
  paid: boolean;
  reason: string;
  vehicleId: string;
  violationId: string;
}

export interface TicketForm_T {
  vehicleId: string;
  violationId: string;
  reason: string;
  amount: number;
}
