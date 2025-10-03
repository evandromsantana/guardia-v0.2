// src/app/(auth)/welcome.tsx

import AuthHeader from "@/src/components/app/auth/AuthHeader";
import WelcomeButtons from "@/src/components/app/auth/WelcomeButtons";
import { COLORS } from "@/src/constants";
import React from "react";
import { StyleSheet, View } from "react-native";

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <AuthHeader
        title="Bem-vindo ao Gardiã"
        subtitle="Caminhe com confiança."
      />

      <WelcomeButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default WelcomeScreen;
