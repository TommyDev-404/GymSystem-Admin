import { prisma } from "../../../lib/prisma.js";
import { PaymentFilterDTO } from "./payments.types.js";

export const getPaymentSummaryService = async () => {

	const [renewal, upgrade, membership] = await prisma.$transaction([
		prisma.payments.aggregate({
			where: {
				payment_type: "Renewal"
			},
			_sum: {
				amount: true,
			},
			_count: {
				_all: true,
			},
		}),

		prisma.payments.aggregate({
			where: {
				payment_type: "Upgrade"
			},
			_sum: {
				amount: true,
			},
			_count: {
				_all: true,
			},
		}),

		prisma.payments.aggregate({
			where: {
				payment_type: "Membership"
			},
			_sum: {
				amount: true,
			},
			_count: {
				_all: true,
			},
		}),
	]);

	return {
		renewal: {
			amount: Number(renewal._sum.amount ?? 0),
			count: renewal._count._all,
		},

		upgrade: {
			amount: Number(upgrade._sum.amount ?? 0),
			count: upgrade._count._all,
		},

		membership: {
			amount: Number(membership._sum.amount ?? 0),
			count: membership._count._all,
		},
	};
};

export const getPaymentsService = async (filters: PaymentFilterDTO) => {
  const where: any = {};

	// SEARCH
	if (filters.search?.trim()) {
	const search = filters.search.trim();
	const searchNumber = Number(search);

	where.OR = [
		{
			members: {
			fullname: {
				contains: search,
			},
			},
		},
		...(Number.isNaN(searchNumber)
			? []
			: [
				{
					id: searchNumber,
				},
			]),
	];
	}

  // PAYMENT TYPE
  if (filters.paymentType && filters.paymentType !== "All") {
    where.payment_type = filters.paymentType;
  }

  // MONTH AND YEAR
  if (filters.month && filters.year) {
    const month = Number(filters.month);
    const year = Number(filters.year);

    if (
      Number.isInteger(month) &&
      month >= 1 &&
      month <= 12 &&
      Number.isInteger(year) &&
      year >= 1000 &&
      year <= 9999
    ) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      where.paid_at = {
        gte: startDate,
        lt: endDate,
      };
    }
  } else if (filters.year) {
    const year = Number(filters.year);

    if (
      Number.isInteger(year) &&
      year >= 1000 &&
      year <= 9999
    ) {
      where.paid_at = {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      };
    }
  } else if (filters.month) {
    const month = Number(filters.month);

    if (
      Number.isInteger(month) &&
      month >= 1 &&
      month <= 12
    ) {
      const currentYear = new Date().getFullYear();

      where.paid_at = {
        gte: new Date(currentYear, month - 1, 1),
        lt: new Date(currentYear, month, 1),
      };
    }
  }

  const payments = await prisma.payments.findMany({
    where,
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
              duration_type: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: {
      paid_at: "desc",
    },
  });

  return payments.map((payment) => {
    const plan = payment.member_memberships.membership_plans;

    return {
      id: payment.id,
      memberId: payment.member_id,
      membershipId: payment.membership_id,
      memberName: payment.members.fullname,
      plan: `${plan.plan_name} (${plan.duration} ${plan.duration_type}) - ${new Intl.NumberFormat(
        "en-PH",
        {
          style: "currency",
          currency: "PHP",
        },
      ).format(Number(plan.price))}`,
      amount: Number(payment.amount),
      status: payment.status,
      paymentType: payment.payment_type,
      paymentMethod: payment.payment_method,
      paidDate: payment.paid_at,
    };
  });
};

