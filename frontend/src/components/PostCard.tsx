'use client';
import { Post, Comment, CommentProps } from '@/endpoints/home/types';
import { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { AiOutlineComment } from 'react-icons/ai';
import { Comments } from './Comments';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useDeletePost } from '@/endpoints/home/deletePost';
import Modal from './modal';
import { useTranslations } from 'next-intl';
import useToast from '@/context/toastContext/useToast';
import useUserContext from '@/context/userContext/useUserContext';
import { useEditPost } from '@/endpoints/home/editPost';
import { IoIosSend } from 'react-icons/io';

export default function PostCard({
  post,
  setTargetComments,
  targetComments,
}: {
  post: Post;
  targetComments: CommentProps | undefined;
  setTargetComments: (pev: CommentProps | undefined) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string | undefined>();
  const [postId, setPostId] = useState<string | undefined>();
  const { showToast } = useToast();
  const { userData } = useUserContext();
  const t = useTranslations();
  const {
    mutateAsync: deletePost,
    isError: isDeleteError,
    error: deleteError,
    isSuccess,
  } = useDeletePost();

  const {
    mutateAsync: updatePost,
    isError: isupdateError,
    error: updateError,
    isSuccess: isUpdateSuccess,
  } = useEditPost();

  const [comments, setComments] = useState<CommentProps | undefined>();

  useEffect(() => {
    if (isSuccess) {
      showToast(t('messages.post-d-success'), 'success');
      setIsOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isDeleteError && deleteError) {
      showToast(deleteError.response.data.message, 'error');
    }
  }, [isDeleteError]);

  useEffect(() => {
    if (isUpdateSuccess) {
      showToast(t('messages.post-e-success'), 'success');
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isupdateError && updateError) {
      showToast(updateError.response.data.message, 'error');
    }
  }, [isupdateError]);

  const handleCommentClick = (id: string, comments: Comment[]) => {
    if (targetComments?.id == id) {
      setTargetComments(undefined);
    } else {
      setTargetComments({ id, comments });
    }
    setComments({ id, comments });
  };

  const handleDeletePost = async () => {
    await deletePost(post.id);
  };

  const handelEditPost = (id: string, content: string) => {
    setPostId(id);
    setPostContent(content);
  };

  const editTargetPost = async () => {
    if (postId && postContent)
      await updatePost({ id: postId, content: postContent });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200  w-[100%] mb-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-3 mb-4">
          <FiUser className="w-10 h-10 text-gray-400 border rounded-full p-2" />
          <div>
            <h3 className="text-lg font-semibold">{post.user?.username}</h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {post.userId == userData?.id ? (
          <div>
            <button
              onClick={() => handelEditPost(post.id, post.content)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white   rounded-md transition duration-200"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 bg-red-500 hover:bg-red-600 ms-2 text-white   rounded-md transition duration-200"
            >
              <MdDelete size={20} />
            </button>
          </div>
        ) : null}
      </div>

      <div>
        {post.id !== postId && (
          <p className="text-gray-800 mb-4">{post.content}</p>
        )}
        {post.id === postId && (
          <div className="p-2 flex gap-2 items-end">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={t('placeHolder.pls-enter-comment')}
              className="w-[75%] focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
            <button
              onClick={() => editTargetPost()}
              className="!h-auto max-h-[80px] p-2 bg-blue-600 hover:bg-blue-700 text-white   rounded-md transition duration-200"
            >
              <IoIosSend size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="flex gap-2"
          onClick={() => handleCommentClick(post.id, post?.comments)}
        >
          <AiOutlineComment size={30} />
        </button>
      </div>

      {comments ? (
        <div
          className={`w-[100%] p-4 bg-gray-800 shadow-lg transition-all duration-300  md:hidden block`}
        >
          <Comments comments={comments} />{' '}
        </div>
      ) : null}

      <Modal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        handleOk={() => handleDeletePost()}
        content={t('questions.delete-post')}
      />
    </div>
  );
}
