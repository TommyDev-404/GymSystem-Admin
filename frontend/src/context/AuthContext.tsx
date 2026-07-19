import { loginApi } from "@/features/auth/api/auth.api";
import {
   createContext,
   useContext,
   useState,
   type ReactNode,
 } from "react";
 
 interface AdminInfo {
   id: number;
   username: string;
   email: string;
   contact: string;
 }
 
 interface AuthContextType {
   admin: AdminInfo | null;
   handleSetAdmin: (data: AdminInfo) => void;
   login: (email: string, password: string) => Promise<void>;
   logout: () => void;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [admin, setAdmin] = useState<AdminInfo | null>(() => {
    const savedAdmin = localStorage.getItem("admin");
  
     //localStorage.removeItem("admin");
    if (savedAdmin) {
      try {
        return JSON.parse(savedAdmin);
      } catch (error) {
        console.error("Invalid admin data in localStorage", error);
        localStorage.removeItem("admin");
        return null;
      }
    }
  
    return null;
  });
  
   const login = async (email: string, password: string ) => {

      const res = await loginApi({
        username: email, // backend expects username
        password: password,
      });
            
     setAdmin(res.user as AdminInfo);
     localStorage.setItem("admin", JSON.stringify(res.user));
   };

   const logout = () => {
     setAdmin(null);
     localStorage.removeItem("admin");
   };

   const handleSetAdmin = (data: AdminInfo) => {
     setAdmin(data);
     
     localStorage.setItem("admin", JSON.stringify(data));
   };
 
   return (
     <AuthContext.Provider
       value={{
         admin,
         handleSetAdmin,
         login,
         logout,
       }}
     >
       {children}
     </AuthContext.Provider>
   );
 }
 
 export function useAuth() {
   const context = useContext(AuthContext);
 
   if (!context) {
     throw new Error("useAuth must be used within an AuthProvider");
   }
 
   return context;
 }