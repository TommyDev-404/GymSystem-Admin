
export interface PaymentFilterDTO {
  search?: string;
  month?: string;
  year?: string;
	paymentType?: "All" | "Membership" | "Renewal" | "Upgrade";
}