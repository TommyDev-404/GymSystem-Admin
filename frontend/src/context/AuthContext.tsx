import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
 } from "react";
 
 import {
	getCurrentAdminApi,
	loginApi,
	logoutApi,
 } from "@/features/auth/api/auth.api";
 
 interface AdminInfo {
	id: number;
	username: string;
	email: string;
	contact: string;
 }
 
 interface AuthContextType {
	admin: AdminInfo | null;
	loading: boolean;
	handleSetAdmin: (data: AdminInfo) => void;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({
	children,
 }: {
	children: ReactNode;
 }) {
	const [admin, setAdmin] = useState<AdminInfo | null>(null);
	const [loading, setLoading] = useState(true);
 
	useEffect(() => {
	  const checkAuth = async () => {
		 try {
			const res = await getCurrentAdminApi();
 
			setAdmin(res.user);
		 } catch (error: any) {
			const status = error?.response?.status;
 
			if (status === 401) {
			  setAdmin(null);
			}
		 } finally {
			setLoading(false);
		 }
	  };
 
	  checkAuth();
	}, []);
 
	const login = async (
	  email: string,
	  password: string
	) => {
	  const res = await loginApi({
		 username: email,
		 password,
	  });
 
	  setAdmin(res.user);
	};
 
	const logout = async () => {
	  try {
		 await logoutApi();
	  } finally {
		 setAdmin(null);
	  }
	};
 
	const handleSetAdmin = (data: AdminInfo) => {
	  setAdmin(data);
	};
 
	return (
	  <AuthContext.Provider
		 value={{
			admin,
			loading,
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
	  throw new Error(
		 "useAuth must be used within an AuthProvider"
	  );
	}
 
	return context;
 }