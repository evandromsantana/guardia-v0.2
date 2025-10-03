import { COLORS } from "@/src/constants";
import { UserProfile } from "@/src/types/user";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import UserDetailDisplay from "../../components/app/profile/UserDetailDisplay";
import { getUserProfile } from "../../services/userService";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery<UserProfile | null, Error>({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ActivityIndicator
        style={styles.centered}
        size="large"
        color={COLORS.primary}
      />
    );
  }

  if (isError || !userProfile) {
    return (
      <View style={styles.centered}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserDetailDisplay userProfile={userProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
