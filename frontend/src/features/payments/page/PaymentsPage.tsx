import { useState } from "react";
import type { Payment } from "@/features/payments/types/payment";
import { PaymentSummaryCards } from "@/features/payments/components/PaymentSummaryCards";
import { PaymentFilters } from "@/features/payments/components/PaymentsFilter";
import { PaymentsTable } from "@/features/payments/components/PaymentTable";

const payments: Payment[] = [
   {
     id: 1,
     member: "Sarah Johnson",
     avatar: "SJ",
     plan: "Premium",
     amount: 89,
     status: "Paid",
     dueDate: "2026-06-01",
     paidDate: "2026-05-30",
   }
 ];

export function PaymentsPage() {
   const [search, setSearch] = useState("");
   const [filterStatus, setFilterStatus] = useState("All");
 
   const filtered = payments.filter((p) => {
     const matchesSearch =
       p.member.toLowerCase().includes(
         search.toLowerCase()
       );
 
     const matchesStatus =
       filterStatus === "All" ||
       p.status === filterStatus;
 
     return matchesSearch && matchesStatus;
   });
 
   return (
     <div className="space-y-6">
 
       <div>
         <h1 className="text-xl font-bold">
           Payments
         </h1>
 
         <p className="text-slate-500 text-sm">
           Manage billing and payment statuses
         </p>
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
 
       <PaymentsTable payments={filtered} />
 
     </div>
   );
 }