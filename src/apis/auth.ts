import { AxiosResponse } from "axios";
import axios from "../utils/axios";
import { DataResponse } from "@/@types/api";
import { SignatureResponseType } from "@/@types/signature";
import { AuthUser } from "@/@types/auth";

export const signIn = (payload: object): Promise<AxiosResponse> =>
  axios.post("/users/users/sign_in", payload);
export const getUploadAvatarSignature = (): Promise<
  AxiosResponse<DataResponse<SignatureResponseType>>
> => axios.get("/users/users/current/avatar_signature");
export const getCurrentUser = (): Promise<AxiosResponse> =>
  axios.get("/users/users/current");

export type UpdateUserType = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  birth?: Date;
};

export const updateProfileAPI = (
  payload: UpdateUserType
): Promise<AxiosResponse<DataResponse<AuthUser>>> =>
  axios.put("/users/users/current", payload);

export const changePassword = (payload: object): Promise<AxiosResponse> =>
  axios.put("/users/users/current/password", payload);
