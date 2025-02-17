'use client';

import useUserContext from '@/context/userContext/useUserContext';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { userData } = useUserContext();
  const t = useTranslations();
  const pathName = usePathname();
  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md py-3 px-6 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center text-xl font-bold rounded-full">
          {userData?.username?.[0]}
        </div>
        <h1 className="text-xl font-semibold">
          {t(`labels.${pathName.split('/')[2]}`)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">
            {userData?.username}
          </p>
          <p className="text-xs text-gray-500">{userData?.email}</p>
        </div>
      </div>
    </header>
  );
}
