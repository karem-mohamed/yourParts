'use client';
import { Comments } from '@/components/Comments';
import PostCard from '@/components/PostCard';
import { useFetchMyPosts } from '@/endpoints/myposts/getMyPosts';
import { Post, Comment } from '@/endpoints/home/types';
import { useCallback, useEffect, useState } from 'react';
import { NoData } from '@/components/NoData';

export default function MyPosts() {
  const { data, mutateAsync } = useFetchMyPosts();
  const [targetComments, setTargetComments] = useState<
    { id: string; comments: Comment[] } | undefined
  >();

  const getPosts = useCallback(async () => {
    await mutateAsync();
  }, [mutateAsync]);
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return (
    <div className="flex md:flex-row flex-col  gap-2">
      <div
        className={`transition-all duration-300 ${targetComments ? 'md:w-[70%]' : 'md:w-full '} w-full`}
      >
        {data?.length ? (
          data?.map((post: Post, index: number) => {
            return (
              <PostCard
                key={index}
                targetComments={targetComments}
                setTargetComments={setTargetComments}
                post={post}
              />
            );
          })
        ) : (
          <NoData />
        )}
      </div>
      {targetComments ? (
        <div className="flex-1 hidden md:block ">
          <div
            className={`fixed top-[65px] bottom-0 w-[28%] p-4 bg-gray-800 shadow-lg transition-all duration-300`}
          >
            <Comments comments={targetComments} mdView={true} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
