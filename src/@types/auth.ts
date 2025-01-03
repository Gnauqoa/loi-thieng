import { UserCredential, User as _FirebaseUser } from "firebase/auth";

// ----------------------------------------------------------------------

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUser = null | {
  id: number;
  birth: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  email: string;
  username: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type FirebaseUser = _FirebaseUser;

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: "jwt";
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export type FirebaseContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: "firebase";
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export type AWSCognitoContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: "cognito";
  login: (email: string, password: string) => Promise<unknown>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<unknown>;
  logout: VoidFunction;
};

export type Auth0ContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: "auth0";
  login: () => Promise<void>;
  logout: VoidFunction;
};
