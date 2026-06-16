export function Toggle({
   value,
   onChange,
 }: {
   value: boolean;
   onChange: (v: boolean) => void;
 }) {
   return (
     <button
       onClick={() => onChange(!value)}
       className={`relative w-11 h-6 rounded-full transition-colors ${
         value ? "bg-emerald-500" : "bg-slate-300"
       }`}
     >
       <span
         className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
           value ? "translate-x-5" : ""
         }`}
       />
     </button>
   );
}
 