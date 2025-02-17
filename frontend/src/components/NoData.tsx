'use client';
import { useTranslations } from 'next-intl';

export function NoData() {
  const t = useTranslations();
  return (
    <div className="col-span-2 flex justify-center items-center h-40 bg-gray-100 text-gray-500 font-semibold rounded-lg">
      {t('messages.no-data')}
    </div>
  );
}
