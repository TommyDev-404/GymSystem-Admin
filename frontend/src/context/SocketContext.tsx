import {
   createContext,
   useContext,
   useEffect,
   type ReactNode,
 } from "react";
 
 import { socket } from "../lib/socket-client";
 
 const SocketContext = createContext(socket);
 
 export function SocketProvider({
   children,
 }: {
   children: ReactNode;
 }) {
 
   useEffect(() => {
     socket.connect();
 
     const handleConnect = () => {
       console.log(
         "Socket connected:",
         socket.id
       );
 
       // Join admin room
       socket.emit(
         "join-admin"
       );
        
       console.log(
         "Joined admin room"
       );
     };
 
     const handleDisconnect = () => {
       console.log(
         "Socket disconnected"
       );
     };
 
     socket.on(
       "connect",
       handleConnect
     );
 
     socket.on(
       "disconnect",
       handleDisconnect
     );
 
     return () => {
       socket.off(
         "connect",
         handleConnect
       );
 
       socket.off(
         "disconnect",
         handleDisconnect
       );
 
       socket.disconnect();
     };
   }, []);
 
   return (
     <SocketContext.Provider value={socket}>
       {children}
     </SocketContext.Provider>
   );
 }
 
 export function useSocket() {
   return useContext(SocketContext);
 }