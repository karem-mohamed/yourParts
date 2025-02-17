'use client';
import CardItem from '@/components/CardItem';
import Modal from '@/components/modal';
import { NoData } from '@/components/NoData';
import useToast from '@/context/toastContext/useToast';
import { useDeleteCategory } from '@/endpoints/categories/deletePost';
import { useFetchCategories } from '@/endpoints/categories/getCategories';
import { Category } from '@/endpoints/categories/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';
import { IoAdd } from 'react-icons/io5';
import { useCreateCategory } from '@/endpoints/categories/ceateCategory';

interface ChildComponentRef {
  closeModal: () => void;
}

export default function MyCategories() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>();
  const [newDesc, setNewDesc] = useState<string>();
  const childRef = useRef<ChildComponentRef>(null);
  const { showToast } = useToast();
  const t = useTranslations();
  const { data, mutateAsync } = useFetchCategories();
  const {
    mutateAsync: createCategoryAsync,
    isSuccess: isCreated,
    isError: isCreateError,
    error: createdError,
  } = useCreateCategory();
  const {
    mutateAsync: deleteCategoryAsync,
    isSuccess,
    isError,
    error,
  } = useDeleteCategory();

  const handleCloseModal = () => {
    if (childRef.current) {
      childRef.current.closeModal();
    }
  };

  const getCategories = useCallback(async () => {
    await mutateAsync();
  }, [mutateAsync]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const deleteCategory = async (id: number | string) => {
    await deleteCategoryAsync(id);
  };

  const handleAddCategory = async () => {
    if (!newDesc || !newName || newDesc.trim() == '' || newName.trim() == '') {
      showToast(t('messages.pls-enter-fields-correctly'), 'info');
      return;
    }
    await createCategoryAsync({ name: newName, description: newDesc });
  };
  useEffect(() => {
    if (isSuccess) {
      showToast(t('messages.post-d-success'), 'success');
      handleCloseModal();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      showToast(error.response.data.message, 'error');
      handleCloseModal();
    }
  }, [isError]);

  useEffect(() => {
    if (isCreated) {
      showToast(t('messages.category-success'), 'success');
      handleCloseModal();
      setNewDesc(undefined);
      setNewName(undefined);
      setIsOpen(false);
    }
  }, [isCreated]);

  useEffect(() => {
    if (isCreateError && createdError) {
      showToast(createdError.response.data.message, 'error');
      handleCloseModal();
      setNewDesc(undefined);
      setNewName(undefined);
      setIsOpen(false);
    }
  }, [isCreateError]);

  return (
    <div className="flex sm:flex-row flex-col flex-wrap gap-4 mt-2">
      <div className="w-full text-end">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bms-2 text-white bg-blue-600  rounded-md transition duration-200"
        >
          <IoAdd size={25} />
        </button>
      </div>
      {data?.length ? (
        data?.map((category: Category, index: number) => {
          return (
            <CardItem
              key={index}
              ref={childRef}
              item={{
                id: category.id,
                name: category.name,
                description: category.description as string,
                userId: category.userId,
              }}
              index={index}
              model="category"
              handleDeleteItem={deleteCategory}
            />
          );
        })
      ) : (
        <NoData />
      )}
      <Modal
        header={t('labels.create-category')}
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        handleOk={handleAddCategory}
        htmlContent={
          <CreateCategort setNewName={setNewName} setNewDesc={setNewDesc} />
        }
      />
    </div>
  );
}

function CreateCategort({
  setNewDesc,
  setNewName,
}: {
  setNewDesc: (v: string) => void;
  setNewName: (v: string) => void;
}) {
  const t = useTranslations();
  return (
    <div>
      <div>
        <label>{t('labels.name')}</label>
        <input
          type="text"
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t('placeHolder.pls-enter-name')}
          className="w-[75%] focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        />
      </div>

      <div className="mt-5">
        <label>{t('labels.describtion')}</label>
        <textarea
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder={t('placeHolder.pls-enter-describtion')}
          className="w-[75%] focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        />
      </div>
    </div>
  );
}
