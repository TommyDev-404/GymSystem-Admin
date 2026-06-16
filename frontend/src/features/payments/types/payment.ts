export interface Payment {
   id: number;
   member: string;
   avatar: string;
   plan: string;
   amount: number;
   status: "Paid" | "Pending" | "Overdue";
   dueDate: string;
   paidDate?: string;
 }