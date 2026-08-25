import { useMemo, useState } from "react";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";

import { usePaymentSummaryData } from "../hooks/usePayments";

import { PageLoader } from "@/components/shared/PageLoader";
import { debounce } from "@/lib/debounce";
import type { PaymentFiltersType, PaymentSummary, PaymentType } from "../types/PaymentTypes";
import { PaymentSummaryCards } from "../components/PaymentSummaryCard";
import PageHeader from "@/components/shared/PageHeader";

export function PaymentsPage() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");

	const [paymentType, setPaymentType] = useState<PaymentType>("All");
	const [date, setDate] = useState<Date | undefined>();

	const debounceSearch = useMemo(
		() =>
			debounce((value: string) => {
				setSearch(value);
			}),
		[]
	);

	const handleSearch = (value: string) => {
		setSearchInput(value);
		debounceSearch(value);
	};

	const params = useMemo<PaymentFiltersType>(
		() => ({
			search: search || undefined,
			paymentType: paymentType !== "All" ? paymentType : undefined,
			date: date,
		}),
		[search, paymentType, date]
	);

	const { data: summaryData = {} as PaymentSummary, isLoading: loadingSummaryData } = usePaymentSummaryData();

	if (loadingSummaryData) return <PageLoader />;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Payments"
				subtitle="Manage billing and payment records"
			/>

			<PaymentSummaryCards
				summary={summaryData}
			/>

			<PaymentFilters
				search={searchInput}
				setSearch={handleSearch}
				paymentType={paymentType}
				setPaymentType={setPaymentType}
				date={date}
				setDate={setDate}
			/>

			<PaymentsTable
				params={params}
			/>
		</div>
	);
}
