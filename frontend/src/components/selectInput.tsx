'use client';
import { Category } from '@/endpoints/home/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  options: Category[] | undefined;
  onSelect: (value: string | number) => void;
  onSearch: (value: string) => void;
  choosen: string | number | undefined;
}

export default function CustomSelect({
  options,
  onSelect,
  onSearch,
  choosen,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedValue, setSelectedValue] = useState<string>();
  const { push } = useRouter();

  const t = useTranslations();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-start bg-white border border-gray-300 py-2 px-4 pr-10 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {selectedValue && choosen ? selectedValue : t('labels.choose')}
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-1">
          <input
            type="text"
            placeholder={t('labels.search-here')}
            value={search}
            onChange={handleSearch}
            className="w-full p-2 border-b border-gray-200 focus:outline-none"
          />

          <ul className="max-h-40 overflow-y-auto">
            {options && options?.length > 0 ? (
              options?.map((option, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onSelect(option.id);
                    setIsOpen(false);
                    setSelectedValue(option.name);
                  }}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li
                onClick={() => push('categories')}
                className="p-2 text-gray-500 cursor-pointer"
              >
                {t('messages.no-results')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
