import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SPACING } from "../../../constants";

interface LockedScreenProps {
  onUnlock: () => void;
}

export const LockedScreen: React.FC<LockedScreenProps> = ({ onUnlock }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guardiã</Text>
      <Text style={styles.subtitle}>Sessão protegida</Text>
      <TouchableOpacity onPress={onUnlock} style={styles.iconButton}>
        <Ionicons name="finger-print" size={64} color={COLORS.white} />
      </TouchableOpacity>
      <Text style={styles.unlockText}>Toque para desbloquear</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
    marginBottom: SPACING["2xl"],
  },
  iconButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  unlockText: {
    fontSize: 16,
    color: COLORS.primary,
  },
});
