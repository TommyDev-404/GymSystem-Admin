export function AdminProfileSection({
   adminName,
   setAdminName,
   adminRole,
   setAdminRole,
   adminEmail,
   setAdminEmail,
   adminPhone,
   setAdminPhone,
 }: any) {
   return (
     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
       <h3 className="text-slate-800 font-medium">Admin Profile</h3>
 
       <div className="grid grid-cols-1 gap-4">
         {/* Full Name */}
         <div>
           <label className="text-slate-600 text-sm mb-1 block">
             Username
           </label>
           <input
             className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
             value={adminName}
             onChange={(e) => setAdminName(e.target.value)}
           />
         </div>
 
         {/* Role */}
         <div>
            <label className="text-slate-600 text-sm mb-1 block">
               Admin Title
            </label>
            <input
               disabled
               value="System Administrator"
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-500"
            />
         </div>
 
         {/* Email */}
         <div>
           <label className="text-slate-600 text-sm mb-1 block">Email</label>
           <input
             type="email"
             className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
             value={adminEmail}
             onChange={(e) => setAdminEmail(e.target.value)}
           />
         </div>
 
         {/* Phone */}
         <div>
           <label className="text-slate-600 text-sm mb-1 block">Phone</label>
           <input
             className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
             value={adminPhone}
             onChange={(e) => setAdminPhone(e.target.value)}
           />
         </div>
       </div>
     </div>
   );
 }