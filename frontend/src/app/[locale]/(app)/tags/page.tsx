'use client';
import CardItem from '@/components/CardItem';
import { NoData } from '@/components/NoData';
import useToast from '@/context/toastContext/useToast';
import { Tag } from '@/endpoints/tags/types';
import { useDeleteTag } from '@/endpoints/tags/deleteTag';
import { useFetchTags } from '@/endpoints/tags/getTags';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';
import { IoAdd } from 'react-icons/io5';
import Modal from '@/components/modal';
import { useCreateTag } from '@/endpoints/tags/ceateTag';

interface ChildComponentRef {
  closeModal: () => void;
}

export default function MyCategories() {
  const childRef = useRef<ChildComponentRef>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>();
  const { showToast } = useToast();
  const t = useTranslations();

  const { data, mutateAsync } = useFetchTags();
  const {
    mutateAsync: deleteTagAsync,
    isSuccess,
    isError,
    error,
  } = useDeleteTag();

  const {
    mutateAsync: createTagAsync,
    isSuccess: isCreated,
    isError: isCreateError,
    error: createdError,
  } = useCreateTag();

  const handleCloseModal = () => {
    if (childRef.current) {
      childRef.current.closeModal();
    }
  };

  const getTags = async () => {
    await mutateAsync();
  };
  useEffect(() => {
    getTags();
  }, []);

  const deleteTag = async (id: number | string) => {
    await deleteTagAsync(id);
  };

  const handleAddTag = async () => {
    if (!newName || newName.trim() == '') {
      showToast(t('messages.pls-enter-fields-correctly'), 'info');
      return;
    }
    await createTagAsync({ name: newName });
  };

  useEffect(() => {
    if (isCreated) {
      showToast(t('messages.tag-success'), 'success');
      handleCloseModal();
      setNewName(undefined);
      setIsOpen(false);
    }
  }, [isCreated]);

  useEffect(() => {
    if (isCreateError && createdError) {
      showToast(createdError.response.data.message, 'error');
      handleCloseModal();
      setNewName(undefined);
      setIsOpen(false);
    }
  }, [isCreateError]);

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

  return (
    <div className="flex sm:flex-row flex-col flex-wrap gap-4">
      <div className="w-full">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bms-2 text-white bg-blue-600  rounded-md transition duration-200"
        >
          <IoAdd size={20} />
        </button>
      </div>
      {data ? (
        data?.map((Tag: Tag, index: number) => {
          return (
            <CardItem
              key={index}
              ref={childRef}
              item={{
                id: Tag.id,
                name: Tag.name,
                userId: Tag.userId,
              }}
              index={index}
              model="tag"
              handleDeleteItem={deleteTag}
            />
          );
        })
      ) : (
        <NoData />
      )}

      <Modal
        header={t('labels.create-tag')}
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        handleOk={handleAddTag}
        htmlContent={<CreateTag setNewName={setNewName} />}
      />
    </div>
  );
}

function CreateTag({ setNewName }: { setNewName: (v: string) => void }) {
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
    </div>
  );
}
