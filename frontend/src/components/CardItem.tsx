'use client';
import { MdDelete } from 'react-icons/md';
import { forwardRef, useImperativeHandle, useState } from 'react';
import Modal from './modal';
import { useTranslations } from 'next-intl';
import useUserContext from '@/context/userContext/useUserContext';

const colors = [
  'border-blue-500',
  'border-red-500',
  'border-yellow-500',
  'border-green-500',
];
const CardItem = forwardRef(
  (
    {
      item,
      index,
      model,
      handleDeleteItem,
    }: {
      item: {
        id: string | number;
        name: string;
        description?: string;
        userId: string;
      };
      index: number;
      model: string;
      handleDeleteItem: (v: string | number) => void;
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { userData } = useUserContext();
    const [targetItem, setTargetItem] = useState<string | number>();
    const t = useTranslations();

    const handleTargetItem = (id: number | string) => {
      setTargetItem(id);
      setIsOpen(true);
    };

    useImperativeHandle(ref, () => ({
      closeModal() {
        setIsOpen(false);
      },
    }));

    return (
      <div
        className={`min-w-64 bg-white p-5 border-t-4 ${colors[index % colors.length]}`}
      >
        <div className="flex justify-between">
          <h3 className="text-xl mb-2 capitalize text-bold">{item.name}</h3>
          <button
            onClick={() => handleTargetItem(item.id)}
            className="p-2  ms-2 text-white  rounded-md transition duration-200"
          >
            {item.userId == userData?.id && (
              <MdDelete className="text-red-600" size={20} />
            )}
          </button>
        </div>
        {item.description && (
          <p className="text-sm opacity-80">
            {item.description || 'No description available.'}
          </p>
        )}

        <Modal
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          handleOk={() => handleDeleteItem(targetItem as string | number)}
          content={t(`questions.delete-${model}`)}
        />
      </div>
    );
  }
);

CardItem.displayName = 'CardItem';

export default CardItem;
