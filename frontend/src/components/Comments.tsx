'use client';
import { CommentProps } from '@/endpoints/home/types';
import { FiUser } from 'react-icons/fi';
import Card from './Card';
import { useTranslations } from 'next-intl';
import { useSendComment } from '@/endpoints/home/sendComment';
import { useEffect, useState } from 'react';
import useToast from '@/context/toastContext/useToast';
import { IoIosSend } from 'react-icons/io';
import useUserContext from '@/context/userContext/useUserContext';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Modal from './modal';
import { useDeleteComment } from '@/endpoints/home/deleteComment';
import { useEditComment } from '@/endpoints/home/editComment';
export function Comments({
  comments,
  mdView,
}: {
  comments: CommentProps;
  mdView?: boolean;
}) {
  const [comment, setComment] = useState<string | undefined>();
  const [targetDeleteId, setTargetDeleteId] = useState<string | undefined>();
  const [targetEditedId, setTargetEditedId] = useState<string | undefined>();
  const [editedValue, setEditedValue] = useState<string | undefined>();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const t = useTranslations();
  const { showToast } = useToast();
  const { userData } = useUserContext();
  const { mutateAsync, isPending, isError } = useSendComment();
  const {
    mutateAsync: editComment,
    isError: isEditError,
    isSuccess: isEditSuccess,
    error,
  } = useEditComment();
  const {
    mutateAsync: deleteComment,
    isError: isDeleteError,
    error: deleteError,
    isSuccess,
  } = useDeleteComment();

  const sendComment = async () => {
    if (comment) {
      await mutateAsync({
        postId: comments.id,
        content: comment,
      });
      showToast(t('messages.comment-success'), 'success');
    }
  };

  useEffect(() => {
    if (isDeleteError && deleteError) {
      showToast(deleteError.response?.data?.message, 'error');
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      showToast(t('messages.comment-d-success'), 'success');
      setIsOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isEditSuccess) {
      showToast(t('messages.comment-e-success'), 'success');
      setEditedValue(undefined);
      setTargetEditedId(undefined);
    }
  }, [isEditSuccess]);

  useEffect(() => {
    if (isEditError && error) {
      showToast(error.response.data.message, 'error');
    }
  }, [isEditError]);

  useEffect(() => {
    if (isDeleteError && deleteError) {
      showToast(deleteError.response.data.message, 'error');
    }
  }, [isDeleteError]);

  const handleOpenDeleteModal = (id: string) => {
    setIsOpen(true);
    setTargetDeleteId(id);
  };

  const handleTargetEditComment = (id: string, content: string) => {
    setTargetEditedId(id);
    setEditedValue(content);
  };
  const handleDeleteComment = async () => {
    if (targetDeleteId) await deleteComment(targetDeleteId);
  };

  const editTargetComment = async () => {
    if (targetEditedId && editedValue)
      await editComment({
        id: targetEditedId,
        content: editedValue,
      });
  };

  return (
    <Card
      className={`border-t bg-white   ${mdView ? 'hidden md:block' : 'block md:hidden max-h-[200px]'} max-w-xl p-2 overflow-y-scroll max-h-screen `}
    >
      <div className="p-2 flex gap-2">
        <input
          type="text"
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('placeHolder.pls-enter-comment')}
          className="w-[75%] focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        />
        <button
          onClick={sendComment}
          disabled={isPending}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white   rounded-md transition duration-200"
        >
          <IoIosSend size={20} />
        </button>
      </div>

      <ul className="space-y-3 p-3">
        {comments?.comments.map((comment) => (
          <li
            key={comment.id}
            className="flex flex-col gap-3 border-t-2 border-gray-400 mt-2 p-5"
          >
            <div className="flex justify-between">
              <div className="flex gap-3">
                <FiUser className="w-8 h-8 text-gray-400 border rounded-full p-2" />
                <span className="font-semibold">{comment.user?.username}</span>
              </div>
              {comment.userId == userData?.id ? (
                <div>
                  <button
                    onClick={() =>
                      handleTargetEditComment(comment.id, comment.content)
                    }
                    className="p-2  text-blue-600   rounded-md transition duration-200"
                  >
                    <FaEdit size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(comment.id)}
                    className="p-2 bms-2 text-red-600   rounded-md transition duration-200"
                  >
                    <MdDelete size={15} />
                  </button>
                </div>
              ) : null}
            </div>
            <div>
              {comment.id !== targetEditedId && (
                <p className="text-gray-700 text-sm"> {comment?.content}</p>
              )}
              {comment.id === targetEditedId && (
                <div className="p-2 flex gap-2">
                  <input
                    type="text"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    placeholder={t('placeHolder.pls-enter-comment')}
                    className="w-[75%] focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                  <button
                    onClick={() => editTargetComment()}
                    disabled={isPending}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white   rounded-md transition duration-200"
                  >
                    <IoIosSend size={20} />
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        handleOk={() => handleDeleteComment()}
        content={t('questions.delete-comment')}
      />
    </Card>
  );
}
