import { Alert } from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

import { createChatRoom } from "../src/services/chatService";
import { endSafeTrip } from "../src/services/tripService";
import { triggerPanicAlert } from "../src/services/alertService";
import { UserProfile } from "../src/types/user";

interface UseMapActionsProps {
  currentUser: UserProfile | null;
  tripId: string | undefined;
}

export const useMapActions = ({ currentUser, tripId }: UseMapActionsProps) => {
  const router = useRouter();

  const handleStartChat = async (recipientId: string) => {
    if (!currentUser) return;
    const chatId = await createChatRoom(currentUser.uid, recipientId);
    router.push(`/chat/${chatId}`);
  };

  const handleEndTrip = async () => {
    if (!tripId) return;
    await endSafeTrip({ tripId });
    router.back();
  };

  const handlePanicAlert = async () => {
    if (!currentUser) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Erro", "Permissão de localização não concedida.");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    await triggerPanicAlert({
      userId: currentUser.uid,
      lastKnownLocation: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
    Alert.alert("Alerta de Pânico", "Seu círculo de guardiãs foi notificado.");
  };

  return { handleStartChat, handleEndTrip, handlePanicAlert };
};
