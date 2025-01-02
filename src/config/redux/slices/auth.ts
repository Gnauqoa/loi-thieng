import { createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { dispatch, useDispatch, useSelector } from "../store";
import { isValidToken, setSession } from "@/utils/jwt";
import { getCurrentUser, signIn } from "@/apis/auth";
import { AuthState, AuthUser, FirebaseUser } from "@/@types/auth";
import { toastSuccess } from "@/utils/toast";
import {
  getFirebaseToken,
  getToken,
  removeFirebaseToken,
  removeToken,
} from "@/utils/local-storage";
import axios from "@/utils/axios";
import { auth, signInFirebaseWithToken } from "@/config/firebase";
import { onAuthStateChanged, UserCredential } from "@firebase/auth";
// ----------------------------------------------------------------------

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  firebaseUser: null,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "auth",
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

    // INITIALIZE AUTH
    initializeAuthSuccess(state, action) {
      state.isLoading = false;
      state.isInitialized = true;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload?.user || state.user;
      state.firebaseUser = action.payload?.firebaseUser || state.firebaseUser;
    },

    // LOGIN
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.firebaseUser = action.payload.firebaseUser;
    },

    // LOGOUT
    logoutSuccess(state) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    // REGISTER
    registerSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  initializeAuthSuccess,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} = slice.actions;

// ----------------------------------------------------------------------

// Initialize authentication
export function initializeAuth() {
  return async () => {
    dispatch(slice.actions.startLoading());
    if (auth)
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          dispatch(
            slice.actions.initializeAuthSuccess({
              isAuthenticated: true,
              firebaseUser: firebaseUser,
            })
          );
        }
      });

    try {
      const accessToken = typeof window !== "undefined" ? await getToken() : "";
      let user: AuthUser | null = null;
      let firebaseUser: FirebaseUser | null = null;

      if (accessToken && isValidToken(accessToken)) {
        const response = await getCurrentUser();
        user = response.data.data;
      } else {
        return dispatch(
          slice.actions.initializeAuthSuccess({ isAuthenticated: false })
        );
      }

      const firebaseToken =
        typeof window !== "undefined" ? await getFirebaseToken() : "";

      if (firebaseToken) {
        firebaseUser = (await signInFirebaseWithToken(firebaseToken)).user;
      }

      dispatch(
        slice.actions.initializeAuthSuccess({
          isAuthenticated: true,
          user,
          firebaseUser,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Login
export function login(credentials: { account: string; password: string }) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await signIn(credentials);
      const user = response.data.data.user;
      toastSuccess(`Chào mừng ${user.role}: ${user.username || user.email}`);

      const firebaseToken = response.data.data.firebase_token;

      const firebaseUser: FirebaseUser = (
        await signInFirebaseWithToken(firebaseToken)
      ).user;

      dispatch(slice.actions.loginSuccess({ user, firebaseUser }));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Logout
export function logout() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await removeToken();
      await removeFirebaseToken();
      axios.defaults.headers.common["Authorization"] = "";
      dispatch(slice.actions.logoutSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

// Register
export function register(credentials: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post("/api/account/register", credentials);
      const { user } = response.data;
      dispatch(slice.actions.registerSuccess({ user }));
    } catch (error) {
      dispatch(slice.actions.hasError((error as AxiosError).message));
    }
  };
}

export const useAuth = () => ({
  dispatch: useDispatch(),
  ...useSelector((state) => state.auth),
});
