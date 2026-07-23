import {
   CreditCard,
   AlertCircle,
   Trophy,
   UserCheck,
   Bell,
 } from "lucide-react";
 
 export const typeConfig = {
   PAYMENT: {
     icon: CreditCard,
     color: "bg-emerald-100 text-emerald-600",
     label: "Payment",
   },
   EXPIRY: {
     icon: AlertCircle,
     color: "bg-amber-100 text-amber-600",
     label: "Expiry",
   },
   REWARD: {
     icon: Trophy,
     color: "bg-purple-100 text-purple-600",
     label: "Reward",
   },
   CHECK_IN: {
     icon: UserCheck,
     color: "bg-indigo-100 text-indigo-600",
     label: "Check-In",
   },
   ALERT: {
     icon: Bell,
     color: "bg-red-100 text-red-600",
     label: "Alert",
   },
 } as const;