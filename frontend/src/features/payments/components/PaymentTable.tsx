import type { Payment } from "@/features/payments/types/payment";
import { statusConfig } from "@/features/payments/constants/statusConfig";

interface Props {
  payments: Payment[];
}

export function PaymentsTable({ payments }: Props) {
   const TH_CLASS = "text-left text-slate-500 font-medium px-5 py-3.5";
   
   const getInitials = (name: string) => {
      return name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
   };
   
   return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-sm">
         {/* HEADER */}
         <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
               <th className={TH_CLASS}>Member</th>
               <th className={TH_CLASS}>Plan</th>
               <th className={TH_CLASS}>Amount</th>
               <th className={TH_CLASS}>Status</th>
               <th className={TH_CLASS}>Due Date</th>
               <th className={TH_CLASS}>Paid On</th>
            </tr>
         </thead>

         {/* BODY */}
         <tbody className="divide-y divide-slate-50">
            {payments.length === 0 ? (
               <tr>
               <td
                  colSpan={6}
                  className="h-24 text-center text-slate-400"
               >
                  No payments found.
               </td>
               </tr>
            ) : (
               payments.map((p) => {
               const cfg = statusConfig[p.status];

               return (
                  <tr
                     key={p.id}
                     className="hover:bg-slate-50 transition-colors"
                  >
                     {/* MEMBER */}
                     <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <span className="text-emerald-700 text-xs font-semibold">
                              {getInitials(p.memberName)}
                              </span>
                           </div>
                           <span className="text-slate-700 font-medium">
                              {p.memberName}
                           </span>
                        </div>
                     </td>

                     {/* PLAN */}
                     <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700">
                           {p.plan}
                        </span>
                     </td>

                     {/* AMOUNT */}
                     <td className="px-4 py-4 text-slate-700 font-medium">
                        {new Intl.NumberFormat("en-PH", {
                           style: "currency",
                           currency: "PHP",
                        }).format(p.amount)}
                     </td>

                     {/* STATUS */}
                     <td className="px-4 py-4">
                        <span
                           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.color}`}
                        >
                           <cfg.icon className="h-3 w-3" />
                           {p.status}
                        </span>
                     </td>

                     {/* DUE DATE */}
                     <td className="px-4 py-4 text-slate-500">
                        {new Date(p.dueDate).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric'})}
                     </td>

                     {/* PAID DATE */}
                     <td className="px-4 py-4 text-slate-500">
                        {p.paidDate ? (
                           new Date(p.paidDate).toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                           })
                        ) : (
                           <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-400">
                              Not paid yet
                           </span>
                        )}
                     </td>
                  </tr>
               );
               })
            )}
         </tbody>
         </table>
      </div>
   );
}