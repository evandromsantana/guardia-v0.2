import { COLORS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { db } from "../../api/firebase";
import { AlertInfo } from "../../components/app/guardian-panel/AlertInfo";

import { AlertActions } from "../../components/app/guardian-panel/AlertActions";
import { Alert } from "../../types/alert"; // Import the Alert type

async function getAlert(alertId: string): Promise<Alert | null> {
  const alertRef = doc(db, "alerts", alertId);
  const docSnap = await getDoc(alertRef);
  if (docSnap.exists()) {
    return docSnap.data() as Alert;
  }
  return null;
}

export default function GuardianPanelScreen() {
  const { id: alertId } = useLocalSearchParams<{ id: string }>();

  const { data: alert, isLoading } = useQuery<Alert | null>({
    queryKey: ["alert", alertId],
    queryFn: () => getAlert(alertId!),
    enabled: !!alertId,
  });

  const playAudio = async (uri: string) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

  if (isLoading || !alert) {
    return (
      <ActivityIndicator
        style={styles.centered}
        size="large"
        color={COLORS.primary}
      />
    );
  }

  const region: Region = {
    latitude: alert.lastKnownLocation.latitude,
    longitude: alert.lastKnownLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={alert.lastKnownLocation} />
      </MapView>
      <AlertInfo alert={alert} playAudio={playAudio} />
      <AlertActions alert={alert} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { flex: 1 },
});
