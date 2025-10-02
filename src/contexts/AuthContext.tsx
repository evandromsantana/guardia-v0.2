import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import {
  useLogout,
  useSignInWithGoogle,
} from "../services/authService";
import { auth } from "../api/firebase";

type User = FirebaseUser;

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  logout: ReturnType<typeof useLogout>["mutateAsync"];
  signInWithGoogle: ReturnType<typeof useSignInWithGoogle>["mutateAsync"];
  authError: Error | null;
  isSigningInWithGoogle: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { mutateAsync: logout } = useLogout();
  const {
    mutateAsync: signInWithGoogle,
    isPending: isSigningInWithGoogle,
    error: googleError,
  } = useSignInWithGoogle();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        signInWithGoogle,
        authError: googleError,
        isSigningInWithGoogle,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

