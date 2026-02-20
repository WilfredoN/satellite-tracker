import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Ion } from 'cesium';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15000,
      gcTime: 1000 * 60 * 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
