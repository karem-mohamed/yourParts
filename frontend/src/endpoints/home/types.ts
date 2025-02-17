export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId: number;
  createdAt: Date;
  user: User;
  comments: Comment[];
}

export interface User {
  id: string;
  username: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  user: User;
}

export interface CommentData {
  postId: string;
  content: string;
}

export interface CommentProps {
  id: string;
  comments: Comment[];
}

export interface EditCommentData {
  id: string;
  content: string;
}

export interface EditPostData {
  id: string;
  content: string;
}

export interface CreatePostData {
  title?: string;
  content: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
}
export interface CategoryFetchData {
  search?: string;
  limit?: number;
}

export interface PostPayload {
  limit?: number;
  page?: number;
}
