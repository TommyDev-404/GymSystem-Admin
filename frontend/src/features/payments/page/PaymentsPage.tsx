import { useMemo, useState } from "react";
import { PaymentSummaryCards } from "@/features/payments/components/PaymentSummaryCards";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";
import { AddPaymentModal } from "@/features/payments/components/AddPaymentModal";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePayments, usePaymentSummaryData, useUnpaidMembers } from "../hooks/usePayments";
import type { FilterType } from "../types/payment";
import { PageLoader } from "@/components/shared/PageLoader";
import { debounce } from "@/lib/debounce";
import { toPHP } from "@/utils/currencyConverter";
import { useSearchParams } from "react-router-dom";

export function PaymentsPage() {
  const [searchParams] = useSearchParams();
	
  const urlFilter = searchParams.get("filter");
  const urlAction = searchParams.get("action");
  
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterType>(urlFilter as FilterType || "All");
  const [openAddModal, setOpenAddModal] = useState(urlAction === 'add' ? true : false);

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

  console.log(params);
  const { data: paymentsData = [], isLoading: loadingPayments } = usePayments(params);
  const { data: summaryData = [], isLoading: loadingSummaryData } = usePaymentSummaryData();
  const { data: unpaidMembers = [], isLoading: unpaidMembersLoading } = useUnpaidMembers();

  if (loadingSummaryData || unpaidMembersLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            Payments
          </h1>

          <p className="text-slate-500 text-sm">
            Manage billing and payment statuses
          </p>
        </div>

        <Button className={'bg-emerald-500 py-5 px-3 hover:bg-emerald-600'} onClick={() => setOpenAddModal(true)}>
          <Plus size={10} />
          Add Payment
        </Button>
      </div>

      <PaymentSummaryCards
        totalPaid={summaryData.totalPaid}
        totalPaidAmount={toPHP(summaryData.totalPaidAmount)}
        totalPending={summaryData.totalPending}
        totalPendingAmount={toPHP(summaryData.totalPendingAmount)}
        totalOverdue={summaryData.totalOverdue}
        totalOverdueAmount={summaryData.totalOverdueAmount}
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

      <AddPaymentModal
        unpaidMembers={unpaidMembers}
        open={openAddModal}
        setOpen={setOpenAddModal}
      />
    </div>
  );
}