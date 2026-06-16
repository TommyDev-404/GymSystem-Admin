export interface Member {
   id: number;
   name: string;
   age: number;
   gender: "Male" | "Female";
   expiration: string;
   status: "Active" | "Inactive" | "Suspended";
   plan: "Basic" | "Premium" | "Elite";
   joined: string;
   avatar: string;
 }