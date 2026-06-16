export function GymSection({
   gymName,
   setGymName,
   address,
   setAddress,
   membershipTypes,
   setMembershipTypes,
   openTime,
   setOpenTime,
   closeTime,
   setCloseTime,
 }: any) {
   const toggleMembershipType = (type: string) => {
     if (membershipTypes.includes(type)) {
       setMembershipTypes(membershipTypes.filter((t: string) => t !== type));
     } else {
       setMembershipTypes([...membershipTypes, type]);
     }
   };
 
   return (
     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
       <h3 className="text-slate-800 font-medium">Gym Information</h3>
 
       {/* ================= BASIC INFO ================= */}
       <div className="grid grid-cols-2 gap-4">
         <div>
           <label className="text-slate-600 text-sm mb-1 block">Gym Name</label>
           <input
             className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
             value={gymName}
             onChange={(e) => setGymName(e.target.value)}
           />
         </div>
 
         <div>
           <label className="text-slate-600 text-sm mb-1 block">Member Capacity</label>
           <input
             className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
             value={gymName}
             onChange={(e) => setGymName(e.target.value)}
           />
            </div>
            
         <div className="col-span-2">
           <label className="text-slate-600 text-sm mb-1 block">Address</label>
           <input
             className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
             value={address}
             onChange={(e) => setAddress(e.target.value)}
           />
         </div>
       </div>
 
       {/* ================= MEMBERSHIP TYPES ================= */}
       <div className="pt-2 border-t border-slate-100 space-y-3">
         <h4 className="text-slate-700 font-medium text-sm">
           Available Membership Types
         </h4>
 
         <div className="grid grid-cols-2 gap-3">
           {[
             "Walk-in",
             "Monthly",
             "Quarterly",
             "Yearly",
             "Student Plan",
             "Promo Plan",
           ].map((type) => (
             <label
               key={type}
               className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
             >
               <input
                 type="checkbox"
                 checked={membershipTypes.includes(type)}
                 onChange={() => toggleMembershipType(type)}
               />
               {type}
             </label>
           ))}
         </div>
       </div>
 
       {/* ================= OPERATING HOURS ================= */}
       <div className="pt-2 border-t border-slate-100">
         <h4 className="text-slate-700 font-medium mb-3 text-sm">
           Operating Hours
         </h4>
 
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="text-slate-600 text-sm mb-1 block">
               Opening Time
             </label>
             <input
               type="time"
               className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
               value={openTime}
               onChange={(e) => setOpenTime(e.target.value)}
             />
           </div>
 
           <div>
             <label className="text-slate-600 text-sm mb-1 block">
               Closing Time
             </label>
             <input
               type="time"
               className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
               value={closeTime}
               onChange={(e) => setCloseTime(e.target.value)}
             />
           </div>
         </div>
       </div>
     </div>
   );
 }