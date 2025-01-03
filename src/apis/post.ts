import { Post } from "@/@types/post";
import axios from "../utils/axios";
import {
  DataResponse,
  PaginationParams,
  PaginationResponse,
} from "@/@types/api";

export type GetPostsParams = {
  content?: string;
} & PaginationParams;

// Fetch all posts with optional filters and pagination
export const getPostsAPI = async (
  params: GetPostsParams
): Promise<PaginationResponse<Post>> => {
  const { data } = await axios.get("/users/posts", { params });
  return data;
};

export const likePostAPI = async (id: string): Promise<DataResponse<Post>> => {
  const { data } = await axios.post(`/users/posts/${id}/like`);
  return data;
};

export const unlikePostAPI = async (
  id: string
): Promise<DataResponse<Post>> => {
  const { data } = await axios.delete(`/users/posts/${id}/like`);
  return data;
};

// Fetch a single post by ID
export const getPostByIdAPI = async (
  id: string
): Promise<DataResponse<Post>> => {
  const { data } = await axios.get(`/users/posts/${id}`);
  return data;
};

// Create a new post
export type CreatePostPayload = {
  title: string;
  content: string;
  category_id?: number | null;
  author_id: number;
  publish_date?: Date | null;
};

export const createPostAPI = async (
  payload: CreatePostPayload
): Promise<Post> => {
  const { data } = await axios.post("/users/posts", payload);
  return data;
};

// Update an existing post by ID
export type UpdatePostPayload = {
  title: string;
  content: string;
};

export const updatePostAPI = async (
  id: string,
  payload: UpdatePostPayload
): Promise<DataResponse<Post>> => {
  const { data } = await axios.put(`/users/posts/${id}`, payload);
  return data;
};

// Delete a post by ID
export const deletePostAPI = async (
  id: string
): Promise<DataResponse<Post>> => {
  const { data } = await axios.delete(`/users/posts/${id}`);
  return data;
};

export const deletePostsAPI = async (ids: string[]): Promise<void> => {
  const { data } = await axios.delete(`/users/posts/bulk_delete`, {
    data: { ids },
  });
  return data;
};
