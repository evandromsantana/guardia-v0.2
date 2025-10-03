import { COLORS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface PanicButtonProps {
  onLongPress: () => void;
}

export const PanicButton: React.FC<PanicButtonProps> = ({ onLongPress }) => {
  return (
    <TouchableOpacity style={styles.panicButton} onLongPress={onLongPress}>
      <Ionicons name="alert-circle" size={40} color={COLORS.danger} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  panicButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
});
