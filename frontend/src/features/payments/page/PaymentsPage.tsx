import { useState } from "react";
import { PaymentSummaryCards } from "@/features/payments/components/PaymentSummaryCards";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";
import { AddPaymentModal } from "@/features/payments/components/AddPaymentModal";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePayments } from "../hooks/usePayments";

export function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "Paid" | "Pending" | "Overdue" | "All"
  >("All");
  const [openAddModal, setOpenAddModal] = useState(false);

  const { data: paymentsData = [] } = usePayments({
    search: search || undefined,
    status: filterStatus,
  });

  console.log(paymentsData);

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
        totalPaid={12}
        totalPending={4}
        totalOverdue={5}
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