import { prisma } from "../../../lib/prisma";
import { PaymentFilterDTO } from "./payments.types";

export const getSummaryDataService = async () => {
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  return await prisma.$transaction(async (tx) => {
    const paid = await tx.payments.aggregate({
      where: { status: 'Paid' },
      _sum: { amount: true },
      _count: { id: true }
    })

    const pending = await tx.payments.aggregate({
      where: { status: 'Pending' },
      _count: { member_id: true },
      _sum: { amount: true }
    });

    const monthly = await tx.payments.aggregate({
      where: {
        status: "Paid",
        paid_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _count: { member_id: true},
      _sum: { amount: true},
    });

    return {
      totalPaid: paid._count.id ?? 0,
      totalPaidAmount: paid._sum.amount ?? 0,
      totalPending: pending._count.member_id ?? 0,
      totalPendingAmount: pending._sum.amount ?? 0,
      monthlyRevenue: monthly._sum.amount,
      monthlyPaymentCount:monthly._count.member_id
    }
  });
};

export const createPaymentService = async (data: {
  payment_id: number;
  payment_method: "GCash" | "Cash" | "Bank_Transfer";
  paid_at: Date;
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Find pending payment
    const payment = await tx.payments.findUnique({
      where: {
        id: data.payment_id,
      },
      include: {
        members: {
          select: {
            fullname: true,
          },
        },
        member_memberships: {
          include: {
            membership_plans: {
              select: {
                plan_name: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (payment.status === "Paid") {
      throw new Error("Payment already completed");
    }

    // 2. Update payment status
    const updatedPayment = await tx.payments.update({
        where: {
          id: data.payment_id,
        },
        data: {
          status: "Paid",
          payment_method: data.payment_method,
          paid_at: new Date(data.paid_at),
        },
      });

    // 3. Create member notification
    await tx.notifications.create({
      data: {
         recipient_id: payment.member_id,
         recipient_type: 'MEMBER',
         type: 'PAYMENT',
        title: "Payment Recorded",
        description:
        `Your payment of ₱${payment.amount} for ${new Date(data.paid_at).toLocaleDateString(
          "en-PH",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        )} has been successfully recorded.`
      }
   });

   await tx.notifications.create({
    data: {
      recipient_type: "ADMIN",
      recipient_id: null,
      type: "PAYMENT",
      title: "Payment Received",
      description: `${payment.members.fullname} has paid ₱${payment.amount} 
      for the ${payment.member_memberships.membership_plans.plan_name} membership via ${
        payment.payment_method
      }.`,
    },
  });

    // 4. Create admin activity
    await tx.activities.create({
      data: {
        recipient_id: payment.member_id,
        recipient_type: "ADMIN",
        type: "PAYMENT",
        title: "Payment Recorded",
        description: `${payment.members.fullname} paid ₱${payment.amount} for ${payment.member_memberships.membership_plans.plan_name} plan.`
      }
    });

    return updatedPayment;
  });
};

export const getPaymentsService = async (filters: PaymentFilterDTO) => {
  const payments = await prisma.payments.findMany({
    include: {
      members: {
        select: {
          id: true,
          fullname: true,
        },
      },
      member_memberships: {
        include: {
          membership_plans: {
            select: {
              plan_name: true,
              duration: true,
              duration_type: true
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  let result = payments.map((payment) => {
    return {
      id: payment.id,
      memberId: payment.member_id,
      membershipId: payment.membership_id,
      memberName: payment.members.fullname,
      plan:
        `${payment.member_memberships.membership_plans.plan_name} (${payment.member_memberships.membership_plans.duration} ${payment.member_memberships.membership_plans.duration_type})`,
      amount: Number(payment.amount),
      status: payment.status,
      paymentMethod: payment.payment_method,
      paidDate: payment.paid_at,
      createdAt: payment.created_at
    };
  });

  // FILTER STATUS
  if (filters.status && filters.status !== "All") {
    result = result.filter(
      (payment) => payment.status === filters.status
    );
  }

  // SEARCH
  if (filters.search) {
    const search = filters.search.toLowerCase();

    result = result.filter((payment) => {
      return (
        payment.memberName?.toLowerCase().includes(search) ||
        payment.plan?.toLowerCase().includes(search) ||
        payment.id?.toString().includes(search)
      );
    });
  }

  return result;
};

