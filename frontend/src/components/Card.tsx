import { ReactNode } from 'react';

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
      {children}
    </div>
  );
}
