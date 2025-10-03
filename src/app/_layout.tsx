import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import { LockedScreen } from "../components/app/auth";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth, useColorScheme } from "../hooks";
import {
  authenticateWithBiometrics,
  isBiometricsEnabled,
  promptToEnableBiometrics,
} from "../services";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const promptShown = useRef(false);
  const [isAppLocked, setIsAppLocked] = useState(true);

  // Check if biometrics are enabled on startup
  useEffect(() => {
    const checkBiometrics = async () => {
      const biometricsEnabled = await isBiometricsEnabled();
      if (!biometricsEnabled) {
        setIsAppLocked(false); // Unlock if not enabled
      }
    };
    checkBiometrics();
  }, []);

  // Handle routing and splash screen
  useEffect(() => {
    if (isLoading || isAppLocked) return; // Wait until app is unlocked and auth is loaded

    const inTabsGroup = segments[0] === "(tabs)";

    if (user && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!user && inTabsGroup) {
      router.replace("/welcome");
    }

    SplashScreen.hideAsync();
  }, [user, isLoading, segments, router, isAppLocked]);

  // Prompt to enable biometrics on first login
  useEffect(() => {
    if (user && !promptShown.current) {
      promptToEnableBiometrics();
      promptShown.current = true;
    }
    if (!user) {
      promptShown.current = false;
    }
  }, [user]);

  const handleUnlock = async () => {
    const result = await authenticateWithBiometrics();
    if (result.success) {
      setIsAppLocked(false);
    }
  };

  if (isAppLocked) {
    return <LockedScreen onUnlock={handleUnlock} />;
  }

  return <Slot />;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            {/* Render InitialLayout here to handle auth and routing */}
            <InitialLayout />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
