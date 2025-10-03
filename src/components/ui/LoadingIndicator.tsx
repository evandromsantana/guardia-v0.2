import { COLORS } from "@/src/constants";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text>Carregando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});

export default LoadingIndicator;
