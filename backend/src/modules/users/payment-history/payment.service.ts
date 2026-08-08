import { prisma } from "../../../lib/prisma";

export const getMemberPaymentHistoryService = async (member_id: number) => {
  const [stats, member, payments] = await Promise.all([

    // TOTAL PAID
    prisma.payments.aggregate({
      where: {
        member_id,
        status: 'Paid'
      },
      _sum: {
        amount: true,
      },
    }),


    // CURRENT MEMBERSHIP
    prisma.member_memberships.findFirst({
      where: {
        member_id,
        status: 'Active'
      },
      
      select:{
        end_date: true,
        membership_plans: {
          select: {
            plan_name: true
          }
        }
      }
    }),


    // PAYMENT HISTORY
    prisma.payments.findMany({
      where: {
        status: 'Paid',
        member_id,
      },

      orderBy:{
        created_at:"desc",
      },

      select:{
        id:true,
        created_at:true,
        amount:true,
        payment_method:true,
        status:true,

        members:{
          select:{
            membership_plans:{
              select:{
                plan_name:true,
              }
            }
          }
        }
      }
    })

  ]);

  return {

    stats:{
      totalPaid: stats._sum.amount ?? 0,
      plan: member?.membership_plans?.plan_name ?? "No Plan",
      expires: member?.end_date ?? null,
    },

    payments: payments.map((payment)=>({
      id: payment.id,

      plan:
        payment.members.membership_plans?.plan_name 
        ?? "Unknown",

      amount: payment.amount,

      datePaid: payment.created_at,

      paymentMethod: payment.payment_method,

      status: payment.status,
    }))

  };

};