import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithCustomToken, User } from "firebase/auth";
import { auth } from "@/config/firebase";

// Define the context value type
interface AuthContextValue {
  user: User | null;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isLogin: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Create a provider component
export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  // Login with a custom token
  const loginWithToken = async (token: string): Promise<void> => {
    setLoading(true);
    try {
      await signInWithCustomToken(auth, token);
    } catch (error) {
      console.error("Failed to log in with token:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLogin: user !== null, user, loginWithToken, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a FirebaseAuthProvider");
  }
  return context;
};
