import { useState } from "react";
import { PaymentSummaryCards } from "@/features/payments/components/PaymentSummaryCards";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";
import { AddPaymentModal } from "@/features/payments/components/AddPaymentModal";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePayments, usePaymentSummaryData } from "../hooks/usePayments";
import type { FilterType } from "../types/payment";

function toPHP(value: string) {
  const num = Number(value);
  return new Intl.NumberFormat('en-PH', {
    style: "currency", currency: "PHP"
  }).format(num);
}
      
export function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterType>("All");
  const [openAddModal, setOpenAddModal] = useState(false);

  const { data: paymentsData = [], isLoading: loadingPayments } = usePayments({
    search: search || undefined,
    status: filterStatus,
  });
  
  const { data: summaryData = [], isLoading: loadingSummaryData } = usePaymentSummaryData();

  return (
    <div className="space-y-6">
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
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <PaymentsTable payments={paymentsData} />

      <AddPaymentModal
        open={openAddModal}
        setOpen={setOpenAddModal}
      />
    </div>
  );
}