import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native";

import { GuardianSelectionList } from "../components/app/trip";
import { Button, Input } from "../components/common";

import { useGuardians } from "../components/hooks/guardian";
import { useAuth } from "../hooks/useAuth";

import { Container } from "../components/layout/Container";
import { COLORS } from "../constants";
import { startSafeTrip } from "../services/tripService";

export default function StartTripScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);

  const { data: guardians, isLoading: isLoadingGuardians } = useGuardians(
    user?.uid || ""
  );

  const handleToggleGuardian = (guardianId: string) => {
    setSelectedGuardians((prev) =>
      prev.includes(guardianId)
        ? prev.filter((id) => id !== guardianId)
        : [...prev, guardianId]
    );
  };

  const handleStartTrip = async () => {
    if (!user) return;
    if (!destination) {
      Alert.alert("Erro", "Por favor, insira um destino.");
      return;
    }
    if (selectedGuardians.length === 0) {
      Alert.alert("Erro", "Selecione pelo menos um guardião.");
      return;
    }

    try {
      const tripId = await startSafeTrip({
        userId: user.uid,
        destinationAddress: destination,
        watchers: selectedGuardians,
      });
      router.push(`/map?userId=${user.uid}&tripId=${tripId}`);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível iniciar a viagem."
      );
    }
  };

  if (isLoadingGuardians) {
    return (
      <ActivityIndicator
        style={styles.centered}
        size="large"
        color={COLORS.primary}
      />
    );
  }

  return (
    <Container style={styles.container}>
      <Text style={styles.title}>Iniciar Trajeto Seguro</Text>

      <Input
        label="Destino"
        placeholder="Digite o endereço de destino"
        value={destination}
        onChangeText={setDestination}
      />

      {guardians && (
        <GuardianSelectionList
          guardians={guardians}
          selectedGuardians={selectedGuardians}
          onToggleGuardian={handleToggleGuardian}
        />
      )}

      <Button title="Iniciar Viagem" onPress={handleStartTrip} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
});
