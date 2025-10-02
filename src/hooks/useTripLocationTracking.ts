import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../src/api/firebase";
import { Region } from "react-native-maps";

export const useTripLocationTracking = (
  tripId: string | undefined,
  setRegion: React.Dispatch<React.SetStateAction<Region | null>>
) => {
  useEffect(() => {
    if (tripId) {
      const tripRef = doc(db, "safeTrips", tripId);
      const unsubscribe = onSnapshot(tripRef, (doc) => {
        const tripData = doc.data();
        if (tripData && tripData.location) {
          setRegion({
            latitude: tripData.location.latitude,
            longitude: tripData.location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }
      });
      return () => unsubscribe();
    }
  }, [tripId, setRegion]);
};
