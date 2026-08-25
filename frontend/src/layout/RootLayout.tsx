import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useState } from "react";
import { theme } from "@/utils/theme";

export function RootLayout() {
   const [activePage, setActivePage] = useState("dashboard");

   return (
      <div className={`flex h-screen 
         ${theme.bg}
         dark:bg-stone-800
         overflow-hidden 
         font-sans
      `}>
         {/* Sidebar */}
         <Sidebar 
            activePage={activePage} 
            onNavigate={setActivePage}
         />

         {/* Main area */}
         <div className="
            flex-1 
            flex 
            flex-col 
            min-w-0 
            overflow-hidden
         ">
         
            {/* Top Header */}
            <Header/>

            {/* Page content */}
            <main className="
               flex-1 
               overflow-y-auto 
               p-6
               text-slate-900
               dark:text-slate-100
            ">
               <Outlet />
            </main>

         </div>
      </div>
   );
}