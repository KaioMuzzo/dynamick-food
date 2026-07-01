import { QueryClientProvider } from '@tanstack/react-query';
import '../global.css';
import { Stack } from 'expo-router';
import { queryClient } from '@/src/lib/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
