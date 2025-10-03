// src/services/authService.ts
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  UserCredential,
} from "firebase/auth";

import { auth } from "../api/firebase";
import { disableBiometrics } from "./biometricService";
import { createUserProfile } from "./userService";

// ---------------------------------------------
// Configure Google Sign-In
// ---------------------------------------------
GoogleSignin.configure({
  webClientId:
    "285764900701-0ms0urjjbt46nupka8ba1jj0n13skjto.apps.googleusercontent.com",
});

// ---------------------------------------------
// API Functions
// ---------------------------------------------
/**
 * Realiza login com Google e cria perfil de usuário se for novo.
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  // Verifica se o dispositivo suporta Play Services
  await GoogleSignin.hasPlayServices();

  // Faz login no Google
  await GoogleSignin.signIn();

  // Pega os tokens do Google
  const { idToken } = await GoogleSignin.getTokens();

  if (!idToken) {
    throw new Error("Não foi possível obter o ID token do Google");
  }

  // Cria credencial do Google
  const googleCredential = GoogleAuthProvider.credential(idToken);

  // Faz login no Firebase
  const userCredential = await signInWithCredential(auth, googleCredential);

  // Verifica se é um novo usuário
  const additionalUserInfo = getAdditionalUserInfo(userCredential);
  if (additionalUserInfo?.isNewUser) {
    const { user } = userCredential;
    await createUserProfile(
      user,
      user.displayName || "Usuário",
      user.phoneNumber || "",
      user.photoURL
    );
  }

  return userCredential;
}

/**
 * Realiza logout do Google, Firebase e desabilita biometria.
 */
export async function logout(): Promise<void> {
  try {
    await GoogleSignin.signOut();
    await disableBiometrics();
  } catch (error) {
    console.error("Google Sign Out Error:", error);
  }

  await signOut(auth);
}

// ---------------------------------------------
// React Query Hooks
// ---------------------------------------------

/**
 * Hook React Query para login com Google
 */
export function useSignInWithGoogle(): UseMutationResult<
  UserCredential,
  Error,
  void
> {
  return useMutation<UserCredential, Error, void>({
    mutationFn: signInWithGoogle,
  });
}

/**
 * Hook React Query para logout
 */
export function useLogout(): UseMutationResult<void, Error, void> {
  return useMutation<void, Error, void>({
    mutationFn: logout,
  });
}
