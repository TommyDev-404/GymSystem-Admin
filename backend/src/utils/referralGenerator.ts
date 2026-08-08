
export function generateReferralCode(name: string) {
   const prefix = name
     .replace(/\s+/g, "")
     .substring(0, 4)
     .toUpperCase();
 
   const random = Math.floor(
     10000 + Math.random() * 90000
   );
 
   return `${prefix}${random}`;
 }