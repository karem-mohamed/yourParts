'use client';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

export default function Modal({
  closeModal,
  handleOk,
  isOpen,
  content,
  header,
  htmlContent,
}: {
  closeModal: () => void;
  handleOk: () => void;
  isOpen: boolean;
  content?: string;
  header?: string;
  htmlContent?: ReactNode;
}) {
  const t = useTranslations();
  return isOpen ? (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20"
      onClick={closeModal}
    >
      <div
        className=" bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {header ? (
          <h2 className="text-xl font-semibold mb-4">{header}</h2>
        ) : null}
        {content && <p className="text-center text-gray-700 mb-4">{content}</p>}
        {htmlContent && <div>{htmlContent}</div>}
        <div className="flex justify-center gap-2 mt-5">
          <button
            onClick={handleOk}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            {t('labels.confirm')}
          </button>

          <button
            onClick={closeModal}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-200"
          >
            {t('labels.cancel')}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
