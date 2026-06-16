import {
   CreditCard,
   AlertCircle,
   Trophy,
   UserCheck,
   Bell,
 } from "lucide-react";
 
 export const typeConfig = {
   payment: {
     icon: CreditCard,
     color: "bg-emerald-100 text-emerald-600",
     label: "Payment",
   },
   expiry: {
     icon: AlertCircle,
     color: "bg-amber-100 text-amber-600",
     label: "Expiry",
   },
   reward: {
     icon: Trophy,
     color: "bg-purple-100 text-purple-600",
     label: "Reward",
   },
   checkin: {
     icon: UserCheck,
     color: "bg-indigo-100 text-indigo-600",
     label: "Check-In",
   },
   alert: {
     icon: Bell,
     color: "bg-red-100 text-red-600",
     label: "Alert",
   },
 } as const;