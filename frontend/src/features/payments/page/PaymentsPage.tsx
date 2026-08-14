import { useMemo, useState } from "react";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";

import { usePaymentSummaryData } from "../hooks/usePayments";

import { PageLoader } from "@/components/shared/PageLoader";
import { debounce } from "@/lib/debounce";
import type { PaymentFiltersType, PaymentSummary, PaymentType } from "../types/PaymentTypes";
import { PaymentSummaryCards } from "../components/PaymentSummaryCard";

export function PaymentsPage() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");

	// Payment type filter
	const [paymentType, setPaymentType] = useState<PaymentType>("All");

	// Single date filter
	const [date, setDate] = useState<Date | undefined>();

	// Debounced search
	const debounceSearch = useMemo(
		() =>
			debounce((value: string) => {
				setSearch(value);
			}),
		[]
	);

	// Search input handler
	const handleSearch = (value: string) => {
		setSearchInput(value);
		debounceSearch(value);
	};

	// API params
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
			{/* HEADER */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
						Payments
					</h1>

					<p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
						Manage billing and payment records
					</p>
				</div>
			</div>

			<PaymentSummaryCards
				summary={summaryData}
			/>

			{/* FILTERS */}
			<PaymentFilters
				search={searchInput}
				setSearch={handleSearch}
				paymentType={paymentType}
				setPaymentType={setPaymentType}
				date={date}
				setDate={setDate}
			/>

			{/* PAYMENTS TABLE */}
			<PaymentsTable
				params={params}
			/>
		</div>
	);
}
