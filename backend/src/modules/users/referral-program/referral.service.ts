import { prisma } from "../../../lib/prisma";


export const getMemberReferralDataService = async (member_id: number) => {
 
	const member = await prisma.members.findUnique({
	  where: {
		 id: member_id,
	  },
 
	  select: {
		 referral_code: true,
 
		 referrals_referrals_referrer_idTomembers: {
			select: {
			  referrer_points: true,
			},
		 },
	  },
	});
 
	if (!member) {
	  throw new Error("Member not found");
	}
 
 
	const referrals = member.referrals_referrals_referrer_idTomembers;
 
	return {
	  member_id,
	  referral_code: member.referral_code,
	  total_referred: referrals.length,
 
	  points_earned: referrals.reduce(
		 (total, referral) =>
			total + referral.referrer_points,
		 0
	  ),
	};
};
 
export const getMemberReferralRecordsService = async (member_id: number) => {
   const referrals = await prisma.referrals.findMany({
      where:{
         referrer_id: member_id
      },

      select:{
         referee_points:true,
			referred_at: true,
			
         members_referrals_referee_idTomembers:{
            select:{
               fullname:true,
					join_date: true, 

					member_memberships: {
						select: {
							status: true
						}
					},

					users: {
						select: {
							profile: true
						}
					}
            }
         }
      },

      orderBy:{
         referred_at:"desc"
      }

   });

   return referrals.map((r)=>({
      name: r.members_referrals_referee_idTomembers.fullname,
		status: r.members_referrals_referee_idTomembers.member_memberships[0].status,
		profile: r.members_referrals_referee_idTomembers.users?.profile,
      points_earned: r.referee_points,
      joined_date: r.members_referrals_referee_idTomembers.join_date,
      referred_at: r.referred_at
   }));

};