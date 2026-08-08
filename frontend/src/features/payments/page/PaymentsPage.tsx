import { useMemo, useState } from "react";
import { PaymentSummaryCards } from "@/features/payments/components/PaymentSummaryCards";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";

import { usePayments, usePaymentSummaryData } from "../hooks/usePayments";
import type { FilterType } from "../types/PaymentTypes";
import { PageLoader } from "@/components/shared/PageLoader";
import { debounce } from "@/lib/debounce";
import { toPHP } from "@/utils/currencyConverter";
import { useSearchParams } from "react-router-dom";

export function PaymentsPage() {
  const [searchParams] = useSearchParams();
	
  const urlFilter = searchParams.get("filter");
  
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterType>(urlFilter as FilterType || "Paid");
 
  const debounceSearch = useMemo(
      () =>
        debounce((value: string) => {
         setSearch(value);
        }),
      []
  );
  
	const params = useMemo(() => ({
		search: search || undefined,
    status: filterStatus,
	}), [search, filterStatus]);

  const { data: paymentsData = [], isLoading: loadingPayments } = usePayments(params);
  const { data: summaryData = [], isLoading: loadingSummaryData } = usePaymentSummaryData();

  if (loadingSummaryData) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="
            text-slate-800
            dark:text-slate-100
            font-bold
            text-xl
          ">
            Payments
          </h1>

          <p className="
            text-slate-500
            dark:text-slate-400
            text-sm
            mt-0.5
          ">
            Manage billing and payment statuses
          </p>
        </div>
      </div>

      <PaymentSummaryCards
        totalPaid={summaryData.totalPaid}
        totalPaidAmount={toPHP(summaryData.totalPaidAmount)}
        totalPending={summaryData.totalPending}
        totalPendingAmount={toPHP(summaryData.totalPendingAmount)}
        monthlyRevenue={toPHP(summaryData.monthlyRevenue)}
        monthlyPaymentCount={summaryData.monthlyPaymentCount}
      />

      <PaymentFilters
        search={searchInput}
				setSearch={(value) => {
					setSearchInput(value);
					debounceSearch(value);
				}}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <PaymentsTable
        payments={paymentsData}
        isLoading={loadingPayments}
      />
    </div>
  );
}