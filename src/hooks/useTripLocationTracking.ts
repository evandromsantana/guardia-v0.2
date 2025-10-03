import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

import { Region } from "react-native-maps";
import { db } from "../api/firebase";

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
