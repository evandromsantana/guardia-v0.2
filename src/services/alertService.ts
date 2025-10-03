import { Audio } from "expo-av";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { z } from "zod";
import { db, storage } from "../api/firebase";
// import { Alert } from "../types/alert";
import * as Linking from "expo-linking";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const triggerPanicAlertSchema = z.object({
  userId: z.string(),
  lastKnownLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

async function recordAudio(userId: string): Promise<string | null> {
  try {
    await Audio.requestPermissionsAsync();
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    return new Promise((resolve) => {
      setTimeout(async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `alerts/${userId}/${new Date().toISOString()}.m4a`);
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          resolve(downloadURL);
        } else {
          resolve(null);
        }
      }, 30000); // Record for 30 seconds
    });
  } catch (error) {
    console.error("Failed to record audio", error);
    return null;
  }
}

export async function triggerPanicAlert(
  params: z.infer<typeof triggerPanicAlertSchema>
) {
  const { userId, lastKnownLocation } = triggerPanicAlertSchema.parse(params);

  const audioUrl = await recordAudio(userId);

  const alertsCol = collection(db, "alerts");
  const newAlert = {
    userId,
    lastKnownLocation,
    audioFileUrl: audioUrl,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(alertsCol, newAlert);
  const alertId = docRef.id;

  const deepLink = Linking.createURL(`/guardian-panel/${alertId}`);

  const functions = getFunctions();
  const onPanicAlertTriggered = httpsCallable(functions, "onPanicAlertTriggered");

  await onPanicAlertTriggered({ userId, lastKnownLocation, audioUrl, deepLink });
}
