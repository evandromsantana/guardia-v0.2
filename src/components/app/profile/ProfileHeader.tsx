import { COLORS } from "@/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

interface ProfileHeaderProps {
  photoUrl?: string;
  displayName?: string;
  email?: string | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  photoUrl,
  displayName,
  email,
}) => {
  const renderAvatar = () => {
    if (photoUrl) {
      return <Image source={{ uri: photoUrl }} style={styles.avatar} />;
    }

    // fallback nativo
    if (Platform.OS === "ios") {
      return (
        <SymbolView
          name="person.fill"
          size={120}
          colors={[COLORS.grayDark]}
          style={styles.avatar}
        />
      );
    }

    return (
      <MaterialIcons
        name="person"
        size={120}
        color={COLORS.grayDark}
        style={styles.avatar}
      />
    );
  };

  return (
    <View style={styles.profileavatar}>
      {renderAvatar()}
      <Text style={styles.name}>{displayName || "Usuário"}</Text>
      {email ? <Text style={styles.email}>{email}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  profileavatar: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    width: "100%",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold" as any,
    color: COLORS.primary,
  },
  email: {
    fontSize: 16,
    color: COLORS.grayDark,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: COLORS.grayLight,
    overflow: "hidden",
  },
});
