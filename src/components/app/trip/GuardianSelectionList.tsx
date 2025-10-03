import { COLORS } from "@/src/constants";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { GuardianSelectionItem } from "./GuardianSelectionItem";

interface Guardian {
  guardianUid: string;
  fullName?: string;
  email?: string;
}

interface GuardianSelectionListProps {
  guardians: Guardian[];
  selectedGuardians: string[];
  onToggleGuardian: (guardianId: string) => void;
}

export const GuardianSelectionList: React.FC<GuardianSelectionListProps> = ({
  guardians,
  selectedGuardians,
  onToggleGuardian,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Selecione suas guardiãs</Text>
      <FlatList
        data={guardians}
        keyExtractor={(item) => item.guardianUid}
        renderItem={({ item }) => (
          <GuardianSelectionItem
            guardian={item}
            isSelected={selectedGuardians.includes(item.guardianUid)}
            onToggle={onToggleGuardian}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
});
