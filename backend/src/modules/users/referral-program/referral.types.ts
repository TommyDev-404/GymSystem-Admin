
export type MemberReferral = {
   member_id: number;
   referral_code: string;
   total_referred: number;
   points_earned: number;
};

export type ReferralRecords = {
   member_id: number;
   name: string;
   status: string;
   points_earned: number;
   join_date: Date;
};
