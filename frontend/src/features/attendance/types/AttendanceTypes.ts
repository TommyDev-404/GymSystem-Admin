
export type QrResponse = {
   qr: string;
}
 
export type Attendance = {
   name: string;
   gender: "Male" | "Female";
   status: string;
   plan: string;
   checkin_time: string
};

export type Filters = {
   year?: number;
   month?: number;
   day?: number;
 };