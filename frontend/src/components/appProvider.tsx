import { ToastProvider } from '@/context/toastContext/toast.provider';
import { UserProvider } from '@/context/userContext/user.provider';
import { ReactNode } from 'react';

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ToastProvider>{children}</ToastProvider>
    </UserProvider>
  );
}
