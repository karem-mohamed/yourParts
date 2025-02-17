'use client';
import { ReactNode, useState } from 'react';

import { UserContext, UserType } from './user.context';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserType>();
  return (
    <UserContext.Provider value={{ setUserData, userData }}>
      {children}
    </UserContext.Provider>
  );
};
