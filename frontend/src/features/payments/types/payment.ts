export type FilterType = "Paid" | "Pending" | "Overdue" | "All"

export interface Payment {
   id: number;
   memberName: string;
   avatar: string;
   plan: string;
   amount: number;
   status: "Paid" | "Pending" | "Overdue";
   dueDate: string;
   paidDate?: string;
}

export type CreatePaymentDTO = {
  member_id: number; // admin selects member name
  amount_paid: number;
  paid_on: string;
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