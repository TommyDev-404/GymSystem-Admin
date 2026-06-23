export type PaymentStatus = "Paid" | "Pending" | "Overdue" | "All";

export interface CreatePaymentDTO {
  bill_id: number;
  amount_paid: number;
  paid_on: string;
}

export interface PaymentFilterDTO {
  status?: PaymentStatus;
  search?: string;
}