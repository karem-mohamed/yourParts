import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'w-full max-w-md bg-white p-8 shadow-lg rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
}
