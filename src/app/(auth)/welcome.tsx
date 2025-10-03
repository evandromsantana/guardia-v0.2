// src/app/(auth)/welcome.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import AuthHeader from "../../components/app/auth/AuthHeader";
import WelcomeButtons from "../../components/app/auth/WelcomeButtons";
import { COLORS } from "../../constants";

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
