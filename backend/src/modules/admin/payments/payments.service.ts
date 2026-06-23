import { prisma } from "../../../lib/prisma";
import { PaymentRepository } from "./payments.repository";
import { CreatePaymentDTO, PaymentFilterDTO } from "./payments.types";

export const PaymentService = {
   createPayment: async (data: {
      member_id: string;
      amount_paid: number;
      paid_on: Date;
    }) => {
      
      return await prisma.$transaction(async (tx) => {
  
        // 1. Find active bill for selected member
        const bill = await tx.member_bills.findFirst({
          where: {
            member_id: Number(data.member_id),
            status: "Pending",
          },
          orderBy: {
            due_date: "desc",
          },
        });
  
        if (!bill) {
          throw new Error("No pending bill found for this member");
        }
         
        // 2. Create payment (linked to bill)
        const payment = await tx.payments.create({
          data: {
            bill_id: bill.id,
            amount_paid: data.amount_paid,
            paid_on: new Date(data.paid_on),
          },
        });
         
        // 3. Mark bill as paid
        await tx.member_bills.update({
          where: { id: bill.id },
          data: { status: "Paid" },
        });
  
        return payment;
      });
   },

   getPayments: async (filters: PaymentFilterDTO) => {
      const bills = await PaymentRepository.findBills();
    
     const today = new Date();
     let result = bills.map((bill: any) => {
      
      console.log("Bill Data: ", bill)
     
        const payment = bill.payments?.[0]; // latest or only payment
        const amount =  bill.status !== 'Paid' ? bill.amount_due : payment?.amount_paid
       
        return {
          id: bill.id,
    
          // 👇 TABLE FIELDS YOU WANT
          memberName: bill.members?.fullname,
          plan: bill.members?.membership_plans.plan_name,
          amount: amount,
          status: bill.status,
          dueDate: bill.due_date,
          paidOn: payment?.paid_on || null,
        };
      });
    
      // 🔍 FILTER
      if (filters.status && filters.status !== "All") {
        result = result.filter((r: any) => r.status === filters.status);
      }
    
      // 🔎 SEARCH
      if (filters.search) {
         console.log('has search...')
        const s = filters.search.toLowerCase();
    
        result = result.filter((r: any) => {
          return (
            r.memberName?.toLowerCase().includes(s) ||
            r.plan?.toLowerCase().includes(s) ||
            r.id?.toString().includes(s)
          );
        });
      }
      
      console.log('all...')
      return result;
    },
  
   getUnpaidMembers: async () => {
      const data = await PaymentRepository.findUnpaidMembers();
    
      return data.map((b: any) => ({
        id: b.members.id,
        name: b.members.fullname,
      }));
    },
};