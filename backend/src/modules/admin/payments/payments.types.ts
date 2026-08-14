
export interface PaymentFilterDTO {
  search?: string;
  date?: Date;
	paymentType?: "All" | "Membership" | "Renewal" | "Upgrade";
}