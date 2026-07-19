import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/style/index.css'
import App from '@/App.tsx'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,  // data stays fresh for 5 min
			gcTime: 10 * 60 * 1000,    // cache removed after 10 min unused
		},
	},
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
      
        <Toaster
          richColors
          position="top-right"
          closeButton
          duration={3000}
        />
        
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </SocketProvider>
  </StrictMode>,
)
