'use client';
import Header from '@/components/header';
import Sidebar from '@/components/sideBar';
import useRefetchUserData from '@/hooks/useFetchUserData';
import { ReactNode, Suspense } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  useRefetchUserData();
  return (
    <Suspense>
      <div>
        <Header />
        <div className="pt-[70px]">
          <Sidebar />
          <div className="ps-20 pe-5 ">{children}</div>
        </div>
      </div>
    </Suspense>
  );
}
