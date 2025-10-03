import { COLORS } from "@/src/constants";
import { getTripHistory } from "@/src/services/tripService";
import { Trip } from "@/src/types/trip"; // Import Trip type
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TripListItem } from "../components/app/trip/TripListItem";
import { useAuth } from "../hooks/useAuth";

export default function TripHistoryScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: trips, isLoading } = useQuery<Trip[]>({
    // Specify Trip[] type
    queryKey: ["tripHistory", user?.uid],
    queryFn: () => getTripHistory(user!.uid),
    enabled: !!user,
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

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripListItem
            trip={item}
            onPress={(tripId) => router.push(`/map?tripId=${tripId}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum histórico de viagem encontrado.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
