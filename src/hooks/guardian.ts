import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptGuardianRequest,
  getGuardians,
  getPendingGuardianRequests,
  inviteGuardian, // Changed from sendGuardianInvitation
  rejectGuardianRequest,
  removeGuardian,
} from "../src/services/guardiansService";

export function useInviteGuardian() { // Changed from useSendGuardianInvitation
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteGuardian, // Changed from sendGuardianInvitation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingGuardianRequests"] });
    },
  });
}

export function useGuardians(userUid: string) {
  return useQuery({
    queryKey: ["guardians", userUid],
    queryFn: () => getGuardians(userUid),
    enabled: !!userUid,
  });
}

export function usePendingGuardianRequests(userUid: string) {
  return useQuery({
    queryKey: ["pendingGuardianRequests", userUid],
    queryFn: () => getPendingGuardianRequests(userUid),
    enabled: !!userUid,
  });
}

export function useAcceptGuardianRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptGuardianRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingGuardianRequests"] });
    },
  });
}

export function useRejectGuardianRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectGuardianRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingGuardianRequests"] });
    },
  });
}

export function useRemoveGuardian() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardians"] });
    },
  });
}
