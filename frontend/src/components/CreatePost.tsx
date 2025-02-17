'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import CustomSelect from './selectInput';
import { useFetchCategories } from '@/endpoints/home/getCategories';
import { useCreatePost } from '@/endpoints/home/ceatePost';
import useToast from '@/context/toastContext/useToast';

export default function CreatePost() {
  const t = useTranslations();
  const [content, setContent] = useState('');
  const [targetCategory, setTargetCategory] = useState<number | undefined>();
  const { showToast } = useToast();

  const { mutateAsync: getCategories, data: categories } = useFetchCategories();
  const { mutateAsync, isSuccess } = useCreatePost();
  const fetchCategories = async () => {
    await getCategories({ limit: 10 });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      showToast(t('messages.post-success'), 'success');
    }
  }, [isSuccess]);

  const handleSubmit = () => {
    if (content.trim() === '' || !targetCategory) {
      showToast(t('messages.pls-choose-category-and-post'), 'info');
    }
    mutateAsync({ content, categoryId: targetCategory as number });
    setContent('');
    setTargetCategory(undefined);
  };

  const handleSearch = async (searchVal: string) => {
    await getCategories({ search: searchVal, limit: 10 });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-fullo">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 outline-none resize-none"
        rows={4}
        placeholder={t('placeHolder.what-in-mind')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div>
        <CustomSelect
          options={categories}
          choosen={targetCategory}
          onSearch={handleSearch}
          onSelect={(id) => setTargetCategory(id as number)}
        />
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          {t('labels.post')}
        </button>
      </div>
    </div>
  );
}
