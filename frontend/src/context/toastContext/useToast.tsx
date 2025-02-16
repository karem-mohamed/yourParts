import { useContext } from 'react';

import { ToastContext } from './toast.context';

const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within an ToastProvider');
  }

  return context;
};

export default useToast;
