interface Props {
   activeReport: string;
   attendanceReport: any[];
   paymentReport: any[];
   memberReport: any[];
 }
 
 export function ReportsTable({
   activeReport,
   attendanceReport,
   paymentReport,
   memberReport,
 }: Props) {
   
    const TH_CLASS = "text-left text-slate-500 font-medium px-5 py-3.5";
    const TD_CLASS = "px-5 py-4";
   
   return (
   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* ATTENDANCE */}
      {activeReport === "Attendance" && (
         <table className="w-full text-sm">
         <thead className="bg-slate-50">
            <tr>
               <th className={TH_CLASS}>Date</th>
               <th className={TH_CLASS}>Total</th>
               <th className={TH_CLASS}>Members</th>
               <th className={TH_CLASS}>Guests</th>
               <th className={TH_CLASS}>Peak</th>
            </tr>
         </thead>

         <tbody className="divide-y divide-slate-50">
            {attendanceReport.map((r, i) => (
               <tr key={i} className="hover:bg-slate-50">
                  <td className={TD_CLASS}>{r.date}</td>
                  <td className={TD_CLASS}>
                     <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                        {r.total}
                     </span>
                  </td>
                  <td className={TD_CLASS}>{r.members}</td>
                  <td className={TD_CLASS}>{r.guests}</td>
                  <td className={TD_CLASS}>{r.peak}</td>
               </tr>
            ))}
         </tbody>
         </table>
      )}

      {/* PAYMENTS */}
      {activeReport === "Payments" && (
         <table className="w-full text-sm">
            <thead className="bg-slate-50">
               <tr>
                  <th className={TH_CLASS}>Date</th>
                  <th className={TH_CLASS}>Member</th>
                  <th className={TH_CLASS}>Plan</th>
                  <th className={TH_CLASS}>Amount</th>
                  <th className={TH_CLASS}>Method</th>
               </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
               {paymentReport.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                     <td className={TD_CLASS}>{r.date}</td>
                     <td className={TD_CLASS}>{r.member}</td>
                     <td className={TD_CLASS}>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                           {r.plan}
                        </span>
                     </td>
                     <td className={TD_CLASS}>${r.amount}</td>
                     <td className={TD_CLASS}>{r.method}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      )}

      {/* MEMBERS */}
      {activeReport === "Members" && (
         <table className="w-full text-sm">
         <thead className="bg-slate-50">
            <tr>
               <th className={TH_CLASS}>Joined</th>
               <th className={TH_CLASS}>Name</th>
               <th className={TH_CLASS}>Age</th>
               <th className={TH_CLASS}>Plan</th>
               <th className={TH_CLASS}>Status</th>
            </tr>
         </thead>

         <tbody className="divide-y divide-slate-50">
            {memberReport.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                  <td className={TD_CLASS}>{r.joined}</td>
                  <td className={TD_CLASS}>{r.name}</td>
                  <td className={TD_CLASS}>{r.age}</td>
                  <td className={TD_CLASS}>
                     <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                        {r.plan}
                     </span>
                  </td>
                  <td className={TD_CLASS}>
                     <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                        {r.status}
                     </span>
                  </td>
               </tr>
            ))}
         </tbody>
         </table>
      )}
   </div>
   );
 }