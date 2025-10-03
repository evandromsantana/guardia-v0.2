import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";
import {
  MapComponent,
  MapLoadingState,
  PanicButton,
  UserInfoCard,
} from "../../components/app/map";
import { Button } from "../../components/common";
import { EmptyState } from "../../components/ui";
import { COLORS } from "../../constants";
import {
  useAuth,
  useMapActions,
  useTargetUserLocation,
  useTripLocationTracking,
} from "../../hooks";
import { getUserProfile } from "../../services/userService";
import { UserProfile } from "../../types/user";

export default function MapScreen() {
  const { user } = useAuth(); // Renamed to 'user' to avoid conflict
  const { userId: targetUserId, tripId } = useLocalSearchParams<{
    userId: string;
    tripId: string;
  }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const { data: currentUserProfile, isLoading: isCurrentUserProfileLoading } =
    useQuery<UserProfile | null>({
      queryKey: ["userProfile", user?.uid],
      queryFn: () => getUserProfile(user?.uid as string),
      enabled: !!user?.uid,
    });

  const { data: targetUser, isLoading: isUserLoading } = useQuery<
    UserProfile | null,
    Error
  >({
    queryKey: ["userProfile", targetUserId],
    queryFn: () => getUserProfile(targetUserId!),
    enabled: !!targetUserId,
  });

  useTripLocationTracking(tripId, setRegion);
  useTargetUserLocation(targetUser, setRegion);

  const { handleStartChat, handleEndTrip, handlePanicAlert } = useMapActions({
    currentUser: currentUserProfile || null, // Pass the fetched UserProfile or null
    tripId,
  });

  if (isUserLoading || !region || isCurrentUserProfileLoading) {
    return <MapLoadingState />;
  }

  return (
    <View style={styles.container}>
      <MapComponent
        region={region}
        setRegion={setRegion}
        clusters={[]}
        onMarkerPress={() => {}}
        onClusterPress={() => {}}
        onMapPress={() => setSelectedUser(null)}
      />

      {selectedUser && (
        <UserInfoCard
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onStartChat={handleStartChat}
        />
      )}

      {tripId && <Button title="Encerrar Viagem" onPress={handleEndTrip} />}

      <PanicButton onLongPress={handlePanicAlert} />

      {!isUserLoading && !targetUser && !tripId && (
        <EmptyState
          message="Usuário ou viagem não encontrado"
          subMessage="Não foi possível encontrar o que você está procurando."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});
