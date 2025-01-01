import { Comment } from "@/@types/comment";
import axios from "../utils/axios";
import {
  DataResponse,
  PaginationParams,
  PaginationResponse,
} from "@/@types/api";

export const likeCommentAPI = async (
  id: string
): Promise<DataResponse<Comment>> => {
  const { data } = await axios.post(`/users/comments/${id}/like`);
  return data;
};

export const unlikeCommentAPI = async (
  id: string
): Promise<DataResponse<Comment>> => {
  const { data } = await axios.delete(`/users/comments/${id}/like`);
  return data;
};

export type GetCommentsParams = {
  content?: string;
  post_id?: number | string;
} & PaginationParams;

// Fetch all posts with optional filters and pagination
export const getCommentsAPI = async (
  params: GetCommentsParams
): Promise<PaginationResponse<Comment>> => {
  const { data } = await axios.get("/users/comments", { params });
  return data;
};

// Fetch a single post by ID
export const getCommentByIdAPI = async (
  id: string
): Promise<DataResponse<Comment>> => {
  const { data } = await axios.get(`/users/comments/${id}`);
  return data;
};

// Create a new post
export type CreateCommentPayload = {
  title: string;
  content: string;
  post_id: number;
};

export const createCommentAPI = async (
  payload: CreateCommentPayload
): Promise<DataResponse<Comment>> => {
  const { data } = await axios.post("/users/comments", payload);
  return data;
};

// Update an existing post by ID
export type UpdateCommentPayload = Partial<CreateCommentPayload>;

export const updateCommentAPI = async (
  id: string,
  payload: UpdateCommentPayload
): Promise<DataResponse<Comment>> => {
  const { data } = await axios.put(`/users/comments/${id}`, payload);
  return data;
};

// Delete a post by ID
export const deleteCommentAPI = async (id: string): Promise<void> => {
  const { data } = await axios.delete(`/users/comments/${id}`);
  return data;
};

export const deleteCommentsAPI = async (ids: string[]): Promise<void> => {
  const { data } = await axios.delete(`/users/comments/bulk_delete`, {
    data: { ids },
  });
  return data;
};
