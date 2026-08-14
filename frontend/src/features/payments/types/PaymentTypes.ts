export type PaymentType = "All" | "Membership" | "Renewal" | "Upgrade";

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
	paymentType?: PaymentType;
}

export type PaymentFiltersType = {
  search?: string;
  date?: Date;
	paymentType?: PaymentType;
};

export type PaymentSummary = {
	renewal: {
		amount: number;
		count: number;
	};
	upgrade: {
		amount: number;
		count: number;
	};
	membership: {
		amount: number;
		count: number;
	};
};
