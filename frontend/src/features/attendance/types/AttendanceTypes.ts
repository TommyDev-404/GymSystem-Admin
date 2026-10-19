
export type QrResponse = {
   qr: string;
}
 

export type Attendance = {
   attendance_id: number,
   name: string;
   gender: "Male" | "Female";
   status: string;
   plan: string;
   daily_limit: number;
 
   morning_checkin_time: string | null;
   morning_checkout_time: string | null;
   afternoon_checkin_time: string | null;
   afternoon_checkout_time: string | null;
 };

export type Filters = {
   year?: number;
   month?: number;
   day?: number;
 };