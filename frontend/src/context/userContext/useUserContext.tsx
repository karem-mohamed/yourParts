import { useContext } from 'react';

import { UserContext } from './user.context';

const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUserContext must be used within an ToastProvider');
  }

  return context;
};

export default useUserContext;
