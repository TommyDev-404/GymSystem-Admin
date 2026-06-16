import {
   AlertCircle,
   CheckCircle2,
   Clock,
 } from "lucide-react";
 
 export const statusConfig = {
   Paid: {
     color: "bg-emerald-100 text-emerald-700 border-emerald-200",
     icon: CheckCircle2,
   },
   Pending: {
     color: "bg-amber-100 text-amber-700 border-amber-200",
     icon: Clock,
   },
   Overdue: {
     color: "bg-red-100 text-red-600 border-red-200",
     icon: AlertCircle,
   },
 };