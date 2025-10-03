import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { NavigableInfoBox } from "@/src/components/app/profile/NavigableInfoBox";

import { useAuth } from "../../../hooks/useAuth";
import ProfileActions from "@/src/components/app/profile/ProfileActions";
import ProfileHeader from "@/src/components/app/profile/ProfileHeader";
import { COLORS } from "@/src/constants";
import { getUserProfile } from "@/src/services/userService";
import ProfileInfoBox from "../../../components/app/profile/ProfileInfoBox";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => getUserProfile(user!.uid),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError || !userProfile) {
    return (
      <View style={styles.centered}>
        <Text>Perfil não encontrado ou erro ao carregar.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHeader
          photoUrl={userProfile.photoUrl ?? undefined}
          displayName={userProfile.displayName}
          email={userProfile.email || undefined}
        />

        <ProfileInfoBox
          title="Bio"
          content={userProfile?.bio || "Nenhuma bio definida."}
        />

        <NavigableInfoBox
          title="Histórico de Viagens"
          content="Ver suas viagens passadas"
          onPress={() => router.push("/trip-history")}
        />

        <ProfileActions onLogout={logout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
