import { prisma } from "../../../lib/prisma";
import { CreatePaymentDTO } from "./payments.types";

export const PaymentRepository = {
  create: async (data: CreatePaymentDTO) => {
    return prisma.payments.create({
      data,
      include: {
        member_bills: {
          include: {
            members: true,
          },
        },
      },
    });
  },

  findAll: async () => {
    return prisma.payments.findMany({
      include: {
        member_bills: {
          include: {
            members: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  findBills: async () => {
    return prisma.member_bills.findMany({
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
   },
  
   findUnpaidMembers: async () => {
      return prisma.member_bills.findMany({
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
    },
};