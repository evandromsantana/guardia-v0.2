import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "../api/firebase";

// Zod Schemas
const guardianInvitationSchema = z.object({
  inviterUid: z.string().min(1, "UID do convidante é obrigatório"),
  targetPhoneNumber: z.string().min(9, "Número de telefone inválido"),
});

const guardianRequestSchema = z.object({
  requestId: z.string().min(1, "ID da solicitação é obrigatório"),
  userUid: z.string().min(1, "UID do usuário é obrigatório"),
});

const removeGuardianSchema = z.object({
  userUid: z.string().min(1, "UID do usuário é obrigatório"),
  guardianUid: z.string().min(1, "UID do guardião é obrigatório"),
});

interface Guardian {
  guardianUid: string;
  status: "pending" | "accepted";
  email?: string; // Optional, for display purposes
  fullName?: string; // Optional, for display purposes
}

export async function inviteGuardian(
  params: z.infer<typeof guardianInvitationSchema>
) {
  try {
    const { inviterUid, targetPhoneNumber } = guardianInvitationSchema.parse(params);

    // Find the invitee's UID by phone number
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", targetPhoneNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Usuário convidado não encontrado.");
    }

    const inviteeUid = querySnapshot.docs[0].id;

    // Add invitation to invitee's guardianships subcollection
    const inviteeGuardianshipRef = doc(
      db,
      "users",
      inviteeUid,
      "guardianships",
      inviterUid
    );
    await setDoc(inviteeGuardianshipRef, {
      guardianUid: inviterUid,
      status: "pending",
    });

    return { success: true, inviteeUid, error: null };
  } catch (error: any) {
    console.error("Error sending guardian invitation:", error);
    return { success: false, inviteeUid: null, error };
  }
}

export async function getGuardians(userUid: string): Promise<Guardian[]> {
  try {
    const guardianshipsRef = collection(db, "users", userUid, "guardianships")
    const q = query(guardianshipsRef, where("status", "==", "accepted"))
    const querySnapshot = await getDocs(q)

    const guardians: Guardian[] = []
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data()
      // Fetch guardian's full name and email for display
      const guardianProfile = await getDoc(doc(db, "users", data.guardianUid))
      if (guardianProfile.exists()) {
        guardians.push({
          guardianUid: data.guardianUid,
          status: data.status,
          email: guardianProfile.data().email,
          fullName: guardianProfile.data().fullName,
        })
      }
    }
    return guardians
  } catch (error) {
    console.error("Error getting guardians:", error)
    throw error
  }
}

export async function getPendingGuardianRequests(
  userUid: string,
): Promise<Guardian[]> {
  try {
    const guardianshipsRef = collection(db, "users", userUid, "guardianships")
    const q = query(guardianshipsRef, where("status", "==", "pending"))
    const querySnapshot = await getDocs(q)

    const requests: Guardian[] = []
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data()
      // Fetch inviter's full name and email for display
      const inviterProfile = await getDoc(doc(db, "users", data.guardianUid))
      if (inviterProfile.exists()) {
        requests.push({
          guardianUid: data.guardianUid,
          status: data.status,
          email: inviterProfile.data().email,
          fullName: inviterProfile.data().fullName,
        })
      }
    }
    return requests
  } catch (error) {
    console.error("Error getting pending guardian requests:", error)
    throw error
  }
}

export async function acceptGuardianRequest(
  params: z.infer<typeof guardianRequestSchema>,
) {
  try {
    const { requestId, userUid } = guardianRequestSchema.parse(params)
    const requestRef = doc(db, "users", userUid, "guardianships", requestId)
    await updateDoc(requestRef, { status: "accepted" })
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error accepting guardian request:", error)
    return { success: false, error }
  }
}

export async function rejectGuardianRequest(
  params: z.infer<typeof guardianRequestSchema>,
) {
  try {
    const { requestId, userUid } = guardianRequestSchema.parse(params)
    const requestRef = doc(db, "users", userUid, "guardianships", requestId)
    await deleteDoc(requestRef)
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error rejecting guardian request:", error)
    return { success: false, error }
  }
}

export async function removeGuardian(
  params: z.infer<typeof removeGuardianSchema>,
) {
  try {
    const { userUid, guardianUid } = removeGuardianSchema.parse(params)
    const guardianRef = doc(db, "users", userUid, "guardianships", guardianUid)
    await deleteDoc(guardianRef)
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error removing guardian:", error)
    return { success: false, error }
  }
}
