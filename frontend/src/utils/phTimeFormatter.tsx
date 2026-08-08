
export const formatPhilippineDate = (date: string) => {
   return new Intl.DateTimeFormat("en-PH",{
      timeZone:"Asia/Manila",
      month:"short",
      day:"numeric",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit",
      hour12:true,
   }).format(new Date(date));

};
