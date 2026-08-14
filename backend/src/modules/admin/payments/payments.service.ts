import { prisma } from "../../../lib/prisma";
import { PaymentFilterDTO } from "./payments.types";

export const getPaymentSummaryService = async () => {
	const now = new Date();

	// Start of current month
	const startOfMonth = new Date(
		now.getFullYear(),
		now.getMonth(),
		1,
		0,
		0,
		0,
		0
	);

	// Start of next month
	const startOfNextMonth = new Date(
		now.getFullYear(),
		now.getMonth() + 1,
		1,
		0,
		0,
		0,
		0
	);

	const [renewal, upgrade, membership] = await prisma.$transaction([
		prisma.payments.aggregate({
			where: {
				payment_type: "Renewal",
				paid_at: {
					gte: startOfMonth,
					lt: startOfNextMonth,
				},
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
				payment_type: "Upgrade",
				paid_at: {
					gte: startOfMonth,
					lt: startOfNextMonth,
				},
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
				payment_type: "Membership",
				paid_at: {
					gte: startOfMonth,
					lt: startOfNextMonth,
				},
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
	if (filters.search) {
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

	// DATE
	if (filters.date) {
		const date = new Date(`${filters.date}T00:00:00`);

		const nextDate = new Date(date);
		nextDate.setDate(nextDate.getDate() + 1);

		where.paid_at = {
			gte: date,
			lt: nextDate,
		};
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
							price: true
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
				}
			).format(Number(plan.price))}`,
			amount: Number(payment.amount),
			status: payment.status,
			paymentType: payment.payment_type,
			paymentMethod: payment.payment_method,
			paidDate: payment.paid_at,
		};
	});
};

