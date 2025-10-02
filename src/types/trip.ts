import { Timestamp } from "firebase/firestore";

export interface Trip {
  id: string;
  userId: string;
  destinationAddress: string;
  watchers: string[];
  status: "active" | "completed";
  createdAt: Timestamp;
  location?: { latitude: number; longitude: number };
}
