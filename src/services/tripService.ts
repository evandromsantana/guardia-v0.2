import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "../api/firebase";
import { Trip } from "../types";

const startTripSchema = z.object({
  userId: z.string(),
  destinationAddress: z.string(),
  watchers: z.array(z.string()),
});

const updateTripLocationSchema = z.object({
  tripId: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

const endTripSchema = z.object({
  tripId: z.string(),
});

export async function startSafeTrip(params: z.infer<typeof startTripSchema>) {
  const { userId, destinationAddress, watchers } = startTripSchema.parse(params);

  const tripsCol = collection(db, "safeTrips");

  const newTrip = {
    userId,
    destinationAddress,
    watchers,
    status: "active",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(tripsCol, newTrip);
  return docRef.id;
}

export async function updateTripLocation(params: z.infer<typeof updateTripLocationSchema>) {
  const { tripId, location } = updateTripLocationSchema.parse(params);

  const tripRef = doc(db, "safeTrips", tripId);

  await updateDoc(tripRef, { location });
}

export async function endSafeTrip(params: z.infer<typeof endTripSchema>) {
  const { tripId } = endTripSchema.parse(params);

  const tripRef = doc(db, "safeTrips", tripId);

  await updateDoc(tripRef, { status: "completed" });
}

export async function getTripHistory(userId: string): Promise<Trip[]> {
  const tripsCol = collection(db, "safeTrips");
  const q = query(tripsCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id,
    ...(doc.data() as Omit<Trip, "id">),
  }));
}
