import { useEffect } from "react";
import { Region } from "react-native-maps";
import { UserProfile } from "../src/types/user";

export const useTargetUserLocation = (
  targetUser: UserProfile | null | undefined,
  setRegion: React.Dispatch<React.SetStateAction<Region | null>>
) => {
  useEffect(() => {
    if (targetUser && targetUser.location) {
      setRegion({
        latitude: targetUser.location.latitude,
        longitude: targetUser.location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [targetUser, setRegion]);
};
