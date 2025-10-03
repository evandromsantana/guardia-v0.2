import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants";
import { Button } from "../../common/Button";

interface AlertInfoProps {
  alert: any; // Usar um tipo mais específico se disponível
  playAudio: (uri: string) => Promise<void>;
}

export const AlertInfo: React.FC<AlertInfoProps> = ({ alert, playAudio }) => {
  return (
    <View style={styles.panelInfo}>
      <Text style={styles.title}>Alerta de Pânico</Text>
      <Text style={styles.text}>Usuária: {alert.userId}</Text>
      {alert.audioFileUrl && (
        <Button
          title="Ouvir Áudio"
          onPress={() => playAudio(alert.audioFileUrl)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panelInfo: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  text: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
});
