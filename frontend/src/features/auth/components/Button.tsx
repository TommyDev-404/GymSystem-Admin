import { theme } from "@/utils/theme";
import { LoaderCircle } from "lucide-react";

interface ButtonProps {
   loading?: boolean;
   actionName: string;
   pendingActionName: string;
}

export default function Button({ loading, actionName, pendingActionName }: ButtonProps) {
   return (
      <button
         type="submit"
         disabled={loading}
         className={`w-full ${theme.gradient} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition mt-4 flex items-center justify-center gap-2`}
      >
         {loading ? (
            <>
               <LoaderCircle className="w-5 h-5 animate-spin" />
               {pendingActionName}
            </>
         ) : actionName }
      </button>
   );
}