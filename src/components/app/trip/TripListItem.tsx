import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Trip } from "@/types/trip";
import { COLORS } from "@/constants";

interface TripListItemProps {
  trip: Trip;
  onPress: (tripId: string) => void;
}

export const TripListItem: React.FC<TripListItemProps> = ({
  trip,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.tripItem} onPress={() => onPress(trip.id)}>
      <Text style={styles.tripDestination}>{trip.destinationAddress}</Text>
      <Text style={styles.tripDate}>
        {new Date(trip.createdAt.seconds * 1000).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tripItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    marginBottom: 10,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  tripDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
