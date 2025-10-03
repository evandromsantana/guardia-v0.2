import { Alert } from "@/src/types/alert";
import { UserProfile } from "@/src/types/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Linking,
  Alert as ReactNativeAlert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, SPACING } from "../../../constants";
import { getUserProfile } from "../../../services/userService";
import { Button } from "../../common/Button";

interface AlertActionsProps {
  alert: Alert;
}

export const AlertActions: React.FC<AlertActionsProps> = ({ alert }) => {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery<UserProfile | null>({
    queryKey: ["userProfile", alert.userId],
    queryFn: () => getUserProfile(alert.userId),
  });

  const handleCallUser = () => {
    if (userProfile?.phoneNumber) {
      Linking.openURL(`tel:${userProfile.phoneNumber}`).catch(() => {
        ReactNativeAlert.alert("Erro", "Não foi possível realizar a chamada.");
      });
    } else {
      ReactNativeAlert.alert(
        "Erro",
        "Número de telefone do usuário não disponível."
      );
    }
  };

  const handleCallEmergency = () => {
    Linking.openURL(`tel:190`).catch(() => {
      ReactNativeAlert.alert(
        "Erro",
        "Não foi possível realizar a chamada de emergência."
      );
    });
  };

  const handleGetRoute = () => {
    if (
      alert.lastKnownLocation?.latitude &&
      alert.lastKnownLocation?.longitude
    ) {
      const { latitude, longitude } = alert.lastKnownLocation;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url).catch(() => {
        ReactNativeAlert.alert(
          "Erro",
          "Não foi possível abrir o aplicativo de mapas."
        );
      });
    } else {
      ReactNativeAlert.alert("Erro", "Localização do usuário não disponível.");
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="small" color={COLORS.primary} />;
  }

  if (isError || !userProfile) {
    return (
      <Text style={{ color: COLORS.danger, textAlign: "center" }}>
        Não foi possível carregar o perfil do usuário.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Ligar para a usuária"
        onPress={handleCallUser}
        variant="action"
      />
      <Button
        title="Ligar para 190"
        onPress={handleCallEmergency}
        variant="alert"
      />
      <Button title="Obter Rota" onPress={handleGetRoute} variant="primary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: SPACING.sm,
  },
});
