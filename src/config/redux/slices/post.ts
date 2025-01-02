import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch, useDispatch, useSelector } from "../store";
import {
  deletePostAPI,
  deletePostsAPI,
  getPostsAPI,
  GetPostsParams,
  likePostAPI,
  unlikePostAPI,
  updatePostAPI,
  UpdatePostPayload,
} from "@/apis/post";
import { Post } from "@/@types/post";
import { PaginationMeta, ReducerDataType } from "@/@types/api";
import { AxiosError } from "axios";

// ----------------------------------------------------------------------

export type PostState = {
  isLoading: boolean;
  error: string | null;
  posts: Record<string, Post>;
} & PaginationMeta<Post>;

export type PostReducerType = ReducerDataType<Post>;

const initialState: PostState = {
  isLoading: false,
  error: null,
  posts: {},
  items: [],
  per_page: 0,
  total_items: 0,
  total_pages: 0,
  current_page: 1,
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    startLoadingPost(state, action) {
      state.items = state.items.map((post) =>
        post.id === action.payload ? { ...post, isLoading: true } : post
      );
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload.items.map((post: PostReducerType) => ({
        ...post,
        isLoading: false,
      }));
      state.total_items = action.payload.total_items;
      state.total_pages = action.payload.total_pages;
      state.current_page = action.payload.current_page;
      state.per_page = action.payload.per_page;

      action.payload.items.forEach((post: Post) => {
        state.posts[post.id] = post;
      });
    },

    getAndPushPostsSuccess(state, action) {
      state.isLoading = false;
      state.items = [...(state.items || []), ...action.payload.items];
      state.items = state.items.map((post) => ({
        ...post,
        isLoading: false,
      }));

      state.total_items = action.payload.total_items;
      state.total_pages = action.payload.total_pages;
      state.current_page = action.payload.current_page;
      state.per_page = action.payload.per_page;

      action.payload.items.forEach((post: Post) => {
        state.posts[post.id] = post;
      });
    },

    // GET POST
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.posts[action.payload.id] = action.payload;

      if (!state.items.find((post) => post.id === action.payload.id)) {
        state.items = [action.payload, ...state.items];
      } else {
        state.items = state.items.map((post) =>
          post.id === action.payload.id
            ? { ...action.payload, isLoading: false }
            : post
        );
      }
    },

    // CREATE POST
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.items = [action.payload, ...state.items];
      state.posts[action.payload.id] = action.payload;
    },

    // UPDATE POST
    updatePostSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.map((post) =>
        post.id === action.payload.id
          ? { ...action.payload, isLoading: false }
          : post
      );

      state.posts[action.payload.id] = action.payload;
    },

    // DELETE POST
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.filter((post) => post.id !== action.payload);

      delete state.posts[action.payload];
    },
    deletePostsSuccess(state, action) {
      state.isLoading = false;
      state.items = state.items.filter(
        (post) => !action.payload.includes(post.id)
      );

      action.payload.forEach((id: string) => {
        delete state.posts[id];
      });
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

export function likePost(id: string) {
  return async () => {
    dispatch(slice.actions.startLoadingPost(id));
    try {
      const response = await likePostAPI(id);
      dispatch(slice.actions.updatePostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export function unlikePost(id: string) {
  return async () => {
    dispatch(slice.actions.startLoadingPost(id));
    try {
      const response = await unlikePostAPI(id);
      dispatch(slice.actions.updatePostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

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
      if (params.page === 1) {
        dispatch(slice.actions.getPostsSuccess(response.data));
      } else dispatch(slice.actions.getAndPushPostsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Fetch a single post by ID
export function getPost(id: string) {
  return async () => {
    dispatch(slice.actions.startLoadingPost(id));
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
    dispatch(slice.actions.startLoadingPost(id));
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
    dispatch(slice.actions.startLoadingPost(id));
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
