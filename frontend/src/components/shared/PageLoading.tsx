export function Loading() {
   return (
     <div className="flex h-screen items-center justify-center">
       <div className="flex flex-col items-center gap-6">
         {/* Animated dots */}
         <div className="flex gap-2">
           <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
           <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
           <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-500" />
         </div>
 
         {/* Text */}
         <div className="text-center">
           <h2 className="text-lg font-semibold text-slate-800">
             Loading data
           </h2>
 
           <p className="mt-1 text-sm text-slate-500">
             Please wait while we retrieve the latest information.
           </p>
         </div>
       </div>
     </div>
   );
 }