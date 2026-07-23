import { prisma } from "../../../lib/prisma";
import { createPaymentNotifForMemberService } from "../notifications/notif.service";
import { PaymentFilterDTO } from "./payments.types";

export const getSummaryDataService = async () => {
  return await prisma.$transaction(async (tx) => {
    const paid = await prisma.payments.aggregate({
      _sum: { amount_paid: true },
      _count: { id: true }
    })

    const pending = await prisma.member_bills.aggregate({
      where: { status: 'Pending' },
      _count: { member_id: true },
      _sum: { amount_due: true }
    });

    const overdue = await prisma.member_bills.aggregate({
      where: { status: 'Overdue' },
      _count: { member_id: true },
      _sum: { amount_due: true }
    });

    return {
      totalPaid: paid._count.id ?? 0,
      totalPaidAmount: paid._sum.amount_paid ?? 0,
      totalPending: pending._count.member_id ?? 0,
      totalPendingAmount: pending._sum.amount_due ?? 0,
      totalOverdue: overdue._count.member_id ?? 0,
      totalOverdueAmount: overdue._sum.amount_due ?? 0
    }
    
  });
};

export const createPaymentService = async (data: {
  member_id: string;
  amount_paid: number;
  paid_on: Date
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

    // create notifications
    await createPaymentNotifForMemberService({
      member_id: Number(data.member_id),
      payment_id: payment.id,
      message:
        `Your payment of ₱${data.amount_paid} for ${new Date(data.paid_on).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: '2-digit' })} has been successfully recorded.`
    });

    const member= await prisma.members.findFirst({
      where: { 
        id: Number(data.member_id)
      },
      select: {
        fullname: true,
        membership_plans: {
          select: {
            plan_name: true
          }
        }
      }
    });

    // create recent activity
    await prisma.activities.create({
      data: {
        member_id: Number(data.member_id),
        recepient_type: 'ADMIN',
        type: 'PAYMENT',
        title: 'Payment Recorded',
        description: `${member?.fullname} paid ₱${data.amount_paid} for his ${member?.membership_plans.plan_name} plan.`,
      }
    });
     
    // 3. Mark bill as paid
    await tx.member_bills.update({
      where: { id: bill.id },
      data: { status: "Paid" },
    });

    return payment;
  });
  
};

export const getPaymentsService = async (filters: PaymentFilterDTO) => {
  const bills = await prisma.member_bills.findMany({
    include: {
      members: {
        include: {
          membership_plans: {
            select: {
              plan_name: true
            }
          }
        }
      },
      payments: true,
    },
  });

  let result = bills.map((bill: any) => {
  
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
     const s = filters.search.toLowerCase();
 
     result = result.filter((r: any) => {
       return (
         r.memberName?.toLowerCase().includes(s) ||
         r.plan?.toLowerCase().includes(s) ||
         r.id?.toString().includes(s)
       );
     });
   }
 
   return result;
};

export const getUnpaidMembersService = async () => {
  const data = await prisma.member_bills.findMany({
    where: {
      status: {
        not: "Paid",
      },
    },
    select: {
      member_id: true,
      members: {
        select: {
          id: true,
          fullname: true,
        },
      },
    },
  });

  return data.map((b: any) => ({
    id: b.members.id,
    name: b.members.fullname,
  }));
};
