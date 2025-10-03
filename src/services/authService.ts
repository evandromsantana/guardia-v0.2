
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";

import { auth } from "../api/firebase";
import * as biometricService from "./biometricService";
import * as userService from "./userService";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: "285764900701-0ms0urjjbt46nupka8ba1jj0n13skjto.apps.googleusercontent.com",
});

// API Functions
async function signInWithGoogle() {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  const userCredential = await signInWithCredential(auth, googleCredential);

  // Check if it's a new user and create a profile
  const additionalUserInfo = getAdditionalUserInfo(userCredential);
  if (additionalUserInfo?.isNewUser) {
    const { user } = userCredential;
    await userService.createUserProfile(
      user,
      user.displayName || "Usuário",
      user.phoneNumber || "",
      user.photoURL
    );
  }

  return userCredential;
}

async function logout() {
  // Sign out from Google and Firebase
  try {
    await GoogleSignin.signOut();
    await biometricService.disableBiometrics();
  } catch (error) {
    console.error("Google Sign Out Error:", error);
  }
  return signOut(auth);
}

// React Query Hooks
export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: signInWithGoogle,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
