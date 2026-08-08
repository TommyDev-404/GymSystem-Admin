
export type Rewards = {
   id: number;
   name: string;
   description: string;
   points_required: number;
   category: string;
   total_claim?: number
};

export interface RewardRedemption {

   id:number;
 
   member_name:string;
 
   reward_name:string;
 
   points_used:number;
 
   status:
     | "Pending"
     | "Claimed"
     | "Cancelled";
 
   redeemed_at:string;
 
 }