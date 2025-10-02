import { Timestamp } from "firebase/firestore";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Alert {
  userId: string;
  status: "active" | "resolved";
  lastKnownLocation: GeoPoint;
  audioFileUrl?: string;
  timestamp: Timestamp;
}
