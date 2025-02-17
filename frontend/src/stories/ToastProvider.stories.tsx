import { ToastProvider } from '@/context/toastContext/toast.provider';
import useToast from '@/context/toastContext/useToast';
import React from 'react';

export default {
  title: 'Components/ToastProvider',
  component: ToastProvider,
};

const ToastDemo = () => {
  const { showToast } = useToast();
  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={() => showToast('Success Message!', 'success')}
      >
        Show Success Toast
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-md"
        onClick={() => showToast('Error Message!', 'error')}
      >
        Show Error Toast
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => showToast('Info Message!', 'info')}
      >
        Show Info Toast
      </button>
    </div>
  );
};

export const Default = () => (
  <ToastProvider>
    <ToastDemo />
  </ToastProvider>
);
