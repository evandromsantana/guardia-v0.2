import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../../constants";

interface GuardianSelectionItemProps {
  guardian: {
    guardianUid: string;
    fullName?: string;
    email?: string;
  };
  isSelected: boolean;
  onToggle: (guardianId: string) => void;
}

export const GuardianSelectionItem: React.FC<GuardianSelectionItemProps> = ({
  guardian,
  isSelected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.guardianItem, isSelected && styles.selectedGuardian]}
      onPress={() => onToggle(guardian.guardianUid)}>
      <Text style={styles.guardianName}>
        {guardian.fullName || guardian.email}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  guardianItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    marginBottom: 10,
  },
  selectedGuardian: {
    backgroundColor: COLORS.primary,
  },
  guardianName: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});
