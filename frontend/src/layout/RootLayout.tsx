import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useState } from "react";

export function RootLayout() {
   const [activePage, setActivePage] = useState("dashboard");

   return (
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
         {/* Sidebar */}
         <Sidebar activePage={activePage} onNavigate={setActivePage}/>

         {/* Main area */}
         <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
         {/* Top Header */}
         <Header/>

         {/* Page content (React Router injects here) */}
         <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
         </main>
         </div>
      </div>
   );
}