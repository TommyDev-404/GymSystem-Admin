export type FilterType = "Paid" | "Pending" | "Overdue" | "All"

export interface Payment {
  id: number;
  memberId: number;
  memberName: string;
  membershipId: number;
  plan: string;
  amount: number;
  status: "Paid" | "Pending" | "Cancelled" | "Refunded";
  paymentMethod?: "Cash" | "GCash" | "Bank Transfer";
  paidDate?: string;
}

export type CreatePaymentDTO = {
  payment_id: number; // admin selects member name
  payment_method: string;
  paid_at: Date;
};

export type PaymentFilters = {
  search?: string;
  status?: "Paid" | "Pending" | "Overdue" | "All";
};

export type UnpaidMember = {
  id: number;
  name: string;
  amount: number;
};

export type Filters = {
   year?: number;
   month?: number;
   day?: number;
 };