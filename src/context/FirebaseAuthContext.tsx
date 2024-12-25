import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, signInWithCustomToken, User } from "firebase/auth";
import { auth } from "@/src/config/firebase";

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
    // const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    //   setUser(firebaseUser);
    //   setLoading(false);
    // });
    // loginWithToken(
    //   "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay01ZDAzd0Bsb2ktdGhpZW5nLWZkNjQzLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstNWQwM3dAbG9pLXRoaWVuZy1mZDY0My5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHl0b29sa2l0Lmdvb2dsZWFwaXMuY29tL2dvb2dsZS5pZGVudGl0eS5pZGVudGl0eXRvb2xraXQudjEuSWRlbnRpdHlUb29sa2l0IiwiaWF0IjoxNzMzOTc0MDQxLCJleHAiOjE3MzM5Nzc2NDEsInVpZCI6NiwiY2xhaW1zIjp7fX0.TkeQ2wQEwtS1VV4DNhzQdTIoyVdsJyVeTFvefeFKypWyHrvINYWy2h4Q6cHefevxqNLEmdxVuxgjXNlJvu4ta63gTzvgQYtaNWq2U8AV5EmpBmxGChq_aTzaQ5IKSDaLHyVZ0tROdT57QK_dB5B1-1q7LESOOoKkN6f8bGzF5GaEG_WG2l73vjo3srP2guQgqncZ86GgWeYfr2cwFDJWHyjkh3T6Ve2RGJtBhoDsKxD-0VXPpgba4K_PLFCtyD87ku8TwbghQtpJ64QHQOWeamXaQ9qrmJiwEf0u6hW6lnYack4GJf1gZukHDG1inYn__0lBENnFpUUjZjy8lb_F-Q"
    // );
    // return unsubscribe; // Cleanup listener on unmount
  }, []);

  // Login with a custom token
  const loginWithToken = async (token: string): Promise<void> => {
    if (!auth) return;
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
    if (!auth) return;
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
