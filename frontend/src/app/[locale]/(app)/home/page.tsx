'use client';
import { Comments } from '@/components/Comments';
import CreatePost from '@/components/CreatePost';
import { NoData } from '@/components/NoData';
import Pagination from '@/components/pagination';
import PostCard from '@/components/PostCard';
import { useFetchPosts } from '@/endpoints/home/getPosts';
import { Post, Comment } from '@/endpoints/home/types';
import { useEffect, useState } from 'react';

export default function Home() {
  const limit = 10;
  const { data, mutateAsync } = useFetchPosts();
  const [targetComments, setTargetComments] = useState<
    | {
        id: string;
        comments: Comment[];
      }
    | undefined
  >();

  const getPosts = async () => {
    await mutateAsync({ limit, page: 1 });
  };
  useEffect(() => {
    getPosts();
  }, []);

  const handlePagination = async (page: number) => {
    await mutateAsync({ limit, page });
  };

  return (
    <>
      <div className="flex md:flex-row flex-col  gap-2">
        <div
          className={`mt-4 transition-all duration-300 ${targetComments ? 'md:w-[70%]' : 'md:w-full '} w-full`}
        >
          <CreatePost />
          {data?.count ? (
            <>
              <div className="mt-4">
                {data?.posts?.map((post: Post, index: number) => {
                  return (
                    <PostCard
                      key={index}
                      targetComments={targetComments}
                      setTargetComments={setTargetComments}
                      post={post}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <NoData />
          )}
          <Pagination
            totalItems={data?.count as number}
            itemsPerPage={limit}
            onPageChange={handlePagination}
          />
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
    </>
  );
}
