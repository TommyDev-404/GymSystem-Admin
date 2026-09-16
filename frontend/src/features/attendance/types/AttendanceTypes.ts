
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
   checkin_time: string;
   checkout_time: string | null;
};

export type Filters = {
   year?: number;
   month?: number;
   day?: number;
 };