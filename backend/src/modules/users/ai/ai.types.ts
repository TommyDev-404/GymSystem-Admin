export interface CoachMemberContext {
   name: string;
   goal: string;
   weight: number; 
 }
 
 export interface CoachContext {
   member: CoachMemberContext;
 }