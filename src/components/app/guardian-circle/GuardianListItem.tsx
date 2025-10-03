import { Button } from "@/src/components/common/Button";
import { COLORS } from "@/src/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GuardianItem {
  guardianUid: string;
  fullName?: string;
  email?: string;
  status: "pending" | "accepted";
}

interface GuardianListItemProps {
  item: GuardianItem;
  handleRemoveGuardian: (guardianUid: string) => Promise<void>;
  handleAcceptRequest: (requestId: string) => Promise<void>;
  handleRejectRequest: (requestId: string) => Promise<void>;
  removeGuardianMutation: { isPending: boolean };
  acceptRequestMutation: { isPending: boolean };
  rejectRequestMutation: { isPending: boolean };
}

export const GuardianListItem: React.FC<GuardianListItemProps> = ({
  item,
  handleRemoveGuardian,
  handleAcceptRequest,
  handleRejectRequest,
  removeGuardianMutation,
  acceptRequestMutation,
  rejectRequestMutation,
}) => {
  return (
    <View style={styles.guardianItem}>
      <Text style={styles.guardianName}>
        {item.fullName || item.email || item.guardianUid}
      </Text>
      {item.status === "accepted" && (
        <Button
          title="Remover"
          onPress={() => handleRemoveGuardian(item.guardianUid)}
          variant="alert"
          disabled={removeGuardianMutation.isPending}
          small
        />
      )}
      {item.status === "pending" && (
        <View style={styles.requestActions}>
          <Button
            title="Aceitar"
            onPress={() => handleAcceptRequest(item.guardianUid)}
            variant="action"
            disabled={acceptRequestMutation.isPending}
            small
          />
          <Button
            title="Rejeitar"
            onPress={() => handleRejectRequest(item.guardianUid)}
            variant="alert"
            disabled={rejectRequestMutation.isPending}
            small
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  guardianItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  guardianName: {
    color: COLORS.white,
    fontSize: 16,
    flex: 1,
  },
  requestActions: {
    flexDirection: "row",
    gap: 10,
  },
});
