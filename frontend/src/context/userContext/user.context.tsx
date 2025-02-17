'use client';
import { createContext } from 'react';
export type UserType = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type UserContextType = {
  userData: UserType | undefined;
  setUserData: (prev: UserType) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
