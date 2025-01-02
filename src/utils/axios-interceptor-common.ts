import { signInFirebaseWithToken } from "@/config/firebase";
import {
  getFirebaseToken,
  getToken,
  saveFirebaseToken,
  saveToken,
} from "./local-storage";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const interceptors = {
  request: [
    async (config: AxiosRequestConfig) => {
      const token = await getToken();

      if (token) {
        config = {
          ...config,
          headers: { Authorization: `Bearer ${token}` },
        };
      }

      return config;
    },
  ],
  response: [
    async (response: AxiosResponse) => {
      if ("/users/users/sign_in" === response.config.url) {
        await saveToken(response.data?.data?.access_token);
        await saveFirebaseToken(response.data?.data?.firebase_token);
      }
      return response;
    },
  ],
  error: [
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // window.location.href = "/auth/sign-in";
      }
      throw error;
    },
  ],
};

export default interceptors;
