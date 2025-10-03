import { COLORS } from "@/src/constants";
import { UserProfile } from "@/src/types/user";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserInfoCardProps {
  user: UserProfile;
  onClose: () => void;
  onStartChat: (userId: string) => void;
}

const UserInfoCard = ({ user, onClose, onStartChat }: UserInfoCardProps) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Image
            source={
              user.photoUrl
                ? { uri: user.photoUrl }
                : require("@/assets/default-avatar.png")
            }
            style={styles.cardAvatar}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.cardName} numberOfLines={1}>
              {user.displayName}
            </Text>
            {user.bio && <Text style={styles.cardBio}>{user.bio}</Text>}
          </View>
        </View>

        <View style={styles.expandedButtonContainer}>
          <TouchableOpacity
            style={[styles.cardButton, styles.proposeButton]}
            onPress={() => onStartChat(user.uid)}>
            <Feather name="message-circle" size={18} color={COLORS.white} />
            <Text style={styles.proposeButtonText}>Iniciar Conversa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "transparent",
  },
  cardContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  header: { flexDirection: "row", alignItems: "center" },
  cardAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  infoContainer: { flex: 1, justifyContent: "center" },
  cardName: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: "LeagueSpartan-Bold",
  },
  cardBio: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: "LeagueSpartan-Regular",
    lineHeight: 22,
    marginTop: 4,
  },
  expandedButtonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
    paddingTop: 12,
  },
  cardButton: {
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    flex: 1,
  },
  proposeButton: { backgroundColor: COLORS.primary },
  proposeButtonText: {
    color: COLORS.white,
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 16,
  },
});

export default UserInfoCard;
