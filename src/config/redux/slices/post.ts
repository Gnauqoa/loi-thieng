import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch, useDispatch, useSelector } from "../store";
import {
  deletePostAPI,
  deletePostsAPI,
  getPostsAPI,
  GetPostsParams,
  updatePostAPI,
  UpdatePostPayload,
} from "@/apis/post";
import { Post } from "@/@types/post";
import { PaginationMeta } from "@/@types/pagination";
import { AxiosError } from "axios";

// ----------------------------------------------------------------------

export type PostState = {
  isLoading: boolean;
  error: string | null;
  post: Post | null;
} & PaginationMeta<Post>;

const initialState: PostState = {
  isLoading: false,
  error: null,
  post: null,
  items: [],
  per_page: 0,
  total_items: 0,
  total_pages: 0,
  current_page: 0,
};

const slice = createSlice({
  name: "post",
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
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total_items = action.payload.total_items;
      state.total_pages = action.payload.total_pages;
      state.current_page = action.payload.current_page;
      state.per_page = action.payload.per_page;
    },

    getAndPushPostsSuccess(state, action) {
      state.isLoading = false;
      state.items = [...(state.items || []), ...action.payload.items];
      state.total_items = action.payload.total_items;
      state.total_pages = action.payload.total_pages;
      state.current_page = action.payload.current_page;
      state.per_page = action.payload.per_page;
    },

    // GET POST
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload;
    },

    // CREATE POST
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.items = [action.payload, ...state.items];
    },

    // UPDATE POST
    updatePostSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    },

    // DELETE POST
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.filter((post) => post.id !== action.payload);
    },
    deletePostsSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.filter(
        (post) => !action.payload.includes(post.id)
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
  getPostsSuccess,
  getAndPushPostsSuccess,
  getPostSuccess,
  createPostSuccess,
  updatePostSuccess,
  deletePostSuccess,
} = slice.actions;

// ----------------------------------------------------------------------

// Fetch all posts
export function getPosts(params: GetPostsParams) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getPostsAPI(params);
      dispatch(slice.actions.getPostsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export function getAndPutPosts(params: GetPostsParams) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getPostsAPI(params);
      dispatch(slice.actions.getAndPushPostsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Fetch a single post by ID
export function getPost(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/admins/posts/${id}`);
      dispatch(slice.actions.getPostSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Create a new post
export function createPost(payload: Partial<Post>, callback?: () => void) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post("/admins/posts", payload);
      dispatch(slice.actions.createPostSuccess(response.data.data));
      if (callback) {
        callback();
      }
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Update an existing post
export function updatePost(
  id: string,
  payload: UpdatePostPayload,
  callback?: () => void
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await updatePostAPI(id, payload);
      dispatch(slice.actions.updatePostSuccess(response));
      if (callback) {
        callback();
      }
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Delete a post by ID
export function deletePost(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await deletePostAPI(id);
      dispatch(slice.actions.deletePostSuccess(id));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export function deletePosts(ids: string[]) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await deletePostsAPI(ids);
      dispatch(slice.actions.deletePostsSuccess(ids));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export const usePost = () => ({
  dispatch: useDispatch(),
  ...useSelector((state) => state.post),
});
