
export type SummaryData = {
   totalMembers: number;
   newMembersThisMonth: number;
   memberTrend: number;
   currentlyPresent: number;
   presentTrend: number;
   totalMalePresent: number;
   totalFemalePresent: number;
   totalPaidThisMonth: number;
   paymentTrendThisMonth: number;
   totalExpiredMemberships: number;
   expiredMembershipTrend: number;
};

export type RevenueTrend = {
   month: string;
   revenue: number
};

export type WeeklyAttendance = {
   day: string;
   presentMembers: number;
};

export type MemberStatus = {
   name: string;
   value: number;
};

export type GenderDistribution = MemberStatus;

export type TopClaimedRewards = {
   name: string;
   claimed: number;
};

export type RecentActivity = {
   name: string;
   action: string;
   time: Date;
   avatar: string;
};

export type ExpiringMembership = {
   id: number;
   fullname: string;
   planName: string;
   endDate: Date;
   daysRemaining: number;
 }