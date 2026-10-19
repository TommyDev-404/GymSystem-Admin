import { useEffect, useMemo, useState } from "react";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";
import { usePaymentSummaryData } from "../hooks/usePayments";
import { PageLoader } from "@/components/shared/PageLoader";
import { debounce } from "@/lib/debounce";
import type {
  PaymentFiltersType,
  PaymentSummary,
  PaymentType,
} from "../types/PaymentTypes";
import { PaymentSummaryCards } from "../components/PaymentSummaryCard";
import PageHeader from "@/components/shared/PageHeader";

export function PaymentsPage() {
  const now = new Date();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("All");
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const debounceSearch = useMemo(
		() =>
		debounce((value: string) => {
			setSearch(value);
		}, 300),
		[setSearch],
	);
	
	useEffect(() => {
		return () => {
		debounceSearch.cancel();
		};
	}, [debounceSearch]);
	
  const handleSearch = (value: string) => {
    setSearchInput(value);
    debounceSearch(value);
  };

  const params = useMemo<PaymentFiltersType>(
    () => ({
      search: search || undefined,
      paymentType,
      month,
      year,
    }),
    [search, paymentType, month, year],
  );

  const {
    data: summaryData = {} as PaymentSummary,
    isLoading: loadingSummaryData,
  } = usePaymentSummaryData(Number(month), Number(year));

  if (loadingSummaryData) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        subtitle="Manage billing and payment records"
      />

      <PaymentSummaryCards summary={summaryData} />

      <PaymentFilters
        search={searchInput}
        setSearch={handleSearch}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
      />

      <PaymentsTable params={params} />
    </div>
  );
}