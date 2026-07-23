import { formatDistanceToNowStrict } from "date-fns";

export const formatTimeAgo = (date: string | Date) => {
   return formatDistanceToNowStrict(new Date(date), {
      addSuffix: true,
   })
      .replace("minutes", "mins")
      .replace("minute", "min")
      .replace("hours", "hrs")
      .replace("hour", "hr")
      .replace("seconds", "secs")
      .replace("second", "sec");
}