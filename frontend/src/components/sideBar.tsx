'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FiMenu, FiX, FiFileText, FiTag, FiLayers } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';
import { SlLogout } from 'react-icons/sl';
import Languages from './languages';
import { FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  return (
    <div
      className={twMerge(
        'fixed top-[66px] flex flex-col h-[calc(100vh-66px)] bg-gray-900 text-white transition-all duration-300 z-10',
        isOpen ? 'w-56' : 'w-16'
      )}
    >
      <button
        className="p-4 text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <div className="flex-1 flex flex-col justify-between">
        <nav className="mt-4">
          <ul className="space-y-2">
            <SidebarItem
              icon={<FaHome className={!isOpen ? 'm-auto' : ''} size={20} />}
              text={t('labels.home')}
              isOpen={isOpen}
              path={'home'}
            />
            <SidebarItem
              icon={
                <FiFileText className={!isOpen ? 'm-auto' : ''} size={20} />
              }
              text={t('labels.myposts')}
              isOpen={isOpen}
              path={'myposts'}
            />
            <SidebarItem
              icon={<FiLayers className={!isOpen ? 'm-auto' : ''} size={20} />}
              text={t('labels.categories')}
              isOpen={isOpen}
              path={'categories'}
            />
            <SidebarItem
              icon={<FiTag className={!isOpen ? 'm-auto' : ''} size={20} />}
              text={t('labels.tags')}
              isOpen={isOpen}
              path={'tags'}
            />
          </ul>
        </nav>

        <div className="flex flex-col">
          <Languages isSliderOpen={isOpen} />
          <button className="p-4 text-white focus:outline-none">
            {isOpen ? t('labels.logout') : <SlLogout size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  text,
  isOpen,
  path,
}: {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  path: string;
}) {
  return (
    <li>
      <Link
        href={path}
        className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-md transition-all"
      >
        {icon}
        {isOpen && <span className="whitespace-nowrap">{text}</span>}
      </Link>
    </li>
  );
}
