import {
	createContext,
	useContext,
	useEffect,
	type ReactNode,
} from "react";

import { socket } from "../lib/socket-client";
import { useQueryClient } from "@tanstack/react-query";

const SocketContext = createContext(socket);

export function SocketProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	// Socket connection
	useEffect(() => {
		const handleConnect = () => {
			console.log("Socket connected:", socket.id);

			// Join admin room
			socket.emit("join-admin");
			
			console.log("Joined admin room");
		};

		const handleDisconnect = () => {
			console.log("Socket disconnected");
		};

		socket.on("connect", handleConnect);
		socket.on("disconnect", handleDisconnect);
		
		// Connect once when the provider mounts
		if (!socket.connected) {
			socket.connect();
		}



		return () => {
			socket.off("connect", handleConnect);
			socket.off("disconnect", handleDisconnect);
		};
	}, []);
	
	// Global socket events
	useEffect(() => {
		const handleNewAttendance = () => {
			queryClient.invalidateQueries({
			  queryKey: ["attendance"],
			});
	  
			queryClient.invalidateQueries({
			  queryKey: ["dashboard-summary-data"],
			});
	  
			queryClient.invalidateQueries({
			  queryKey: ["dashboard-weekly-attendance"],
			});
	  
			queryClient.invalidateQueries({
			  queryKey: ["dashboard-recent-activity"],
			});
		};
		
		const handleRewardRedeemedAndCancelled = () => {
			queryClient.invalidateQueries({
				queryKey: ["reward-redemptions"],
			});

			queryClient.invalidateQueries({
				queryKey: ["rewards"],
			});
			
			queryClient.invalidateQueries({
				queryKey: ["rewards-member-progress"],
			});
		};

		socket.on("attendance:new", handleNewAttendance);
		socket.on("reward:redeemed", handleRewardRedeemedAndCancelled);
		socket.on("reward:cancel-redeemed", handleRewardRedeemedAndCancelled);

		return () => {
			socket.off("attendance:new", handleNewAttendance);
			socket.off("reward:redeemed", handleRewardRedeemedAndCancelled);
			socket.off("reward:cancel-redeemed", handleRewardRedeemedAndCancelled);
		};
	}, [queryClient]);


	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	return useContext(SocketContext);
}