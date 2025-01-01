import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch, useDispatch, useSelector } from "../store";
import {
  deleteCommentAPI,
  deleteCommentsAPI,
  getCommentsAPI,
  GetCommentsParams,
  updateCommentAPI,
  UpdateCommentPayload,
  createCommentAPI,
  CreateCommentPayload,
  likeCommentAPI,
} from "@/apis/comment";
import { Comment } from "@/@types/comment";
import { PaginationMeta, GetByIdParams } from "@/@types/api";
import { AxiosError } from "axios";

// ----------------------------------------------------------------------

export type CommentState = {
  isLoading: boolean;
  error: string | null;
  comments: Record<string, Comment>;
} & PaginationMeta<Comment>;

const initialState: CommentState = {
  isLoading: false,
  error: null,
  comments: {},
  items: [],
  per_page: 0,
  total_items: 0,
  total_pages: 0,
  current_page: 0,
};

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET POSTS
    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total_items = action.payload.total_items;
      state.total_pages = action.payload.total_pages;
      state.current_page = action.payload.current_page;
      state.per_page = action.payload.per_page;

      action.payload.items.forEach((comment: Comment) => {
        state.comments[comment.id] = comment;
      });
    },

    getAndPushCommentsSuccess(state, action) {
      state.isLoading = false;
      state.items = [...(state.items || []), ...action.payload.items];
      state.total_items = action.payload.total_items;
      state.total_pages = action.payload.total_pages;
      state.current_page = action.payload.current_page;
      state.per_page = action.payload.per_page;
    },

    // GET POST
    getCommentSuccess(state, action) {
      state.isLoading = false;
      state.comments[action.payload.id] = action.payload;
    },

    // CREATE POST
    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.items = [action.payload, ...state.items];
    },

    // UPDATE POST
    updateCommentSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.map((comment) =>
        comment.id === action.payload.id ? action.payload : comment
      );
    },

    // DELETE POST
    deleteCommentSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.filter(
        (comment) => comment.id !== action.payload
      );
    },
    deleteCommentsSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.filter(
        (comment) => !action.payload.includes(comment.id)
      );
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getCommentsSuccess,
  getAndPushCommentsSuccess,
  getCommentSuccess,
  createCommentSuccess,
  updateCommentSuccess,
  deleteCommentSuccess,
} = slice.actions;

// ----------------------------------------------------------------------

// Fetch all posts

export function likeComment(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await likeCommentAPI(id);
      dispatch(slice.actions.updateCommentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export function unlikeComment(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await deleteCommentAPI(id);
      dispatch(slice.actions.updateCommentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export function getComments(params: GetCommentsParams) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getCommentsAPI(params);
      dispatch(slice.actions.getCommentsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export function getAndPutComments(params: GetCommentsParams) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getCommentsAPI(params);
      dispatch(slice.actions.getAndPushCommentsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Fetch a single comment by ID
export function getComment(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/admins/posts/${id}`);
      dispatch(slice.actions.getCommentSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
      return null;
    }
  };
}

// Create a new comment
export function createComment(
  payload: CreateCommentPayload,
  callback?: () => void
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await createCommentAPI(payload);
      dispatch(slice.actions.createCommentSuccess(response.data));
      if (callback) {
        callback();
      }
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Update an existing comment
export function updateComment(
  id: string,
  payload: UpdateCommentPayload,
  callback?: () => void
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await updateCommentAPI(id, payload);
      dispatch(slice.actions.updateCommentSuccess(response));
      if (callback) {
        callback();
      }
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Delete a comment by ID
export function deleteComment(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await deleteCommentAPI(id);
      dispatch(slice.actions.deleteCommentSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export function deleteComments(ids: string[]) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await deleteCommentsAPI(ids);
      dispatch(slice.actions.deleteCommentsSuccess(ids));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export const useComment = () => ({
  dispatch: useDispatch(),
  ...useSelector((state) => state.comment),
});
