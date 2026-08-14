import {
	CreditCard,
	Users,
	Trophy,
	UserCheck,
	BadgeDollarSign,
	Bell,
} from "lucide-react";

export const typeConfig = {
	PAYMENT: {
		icon: CreditCard,
		color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
		label: "Payment",
	},

	MEMBERSHIP: {
		icon: BadgeDollarSign,
		color: "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
		label: "Membership",
	},

	REWARD: {
		icon: Trophy,
		color: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
		label: "Reward",
	},

	MEMBER: {
		icon: Users,
		color: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
		label: "Member",
	},

	ATTENDANCE: {
		icon: UserCheck,
		color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
		label: "Attendance",
	},
} as const;

export const defaultTypeConfig = {
	icon: Bell,
	color:
		"bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
	label: "Notification",
};