import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import ChatRoom from "../../components/app/chat/ChatRoom";
import { COLORS } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useSendMessage } from "../../hooks/useSendMessage";
import { getUserProfile } from "../../services/userService";
import { UserProfile } from "../../types/user";

export default function ChatRoomScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const { data: currentUserProfile, isLoading: isCurrentUserProfileLoading } =
    useQuery<UserProfile | null>({
      queryKey: ["userProfile", user?.uid],
      queryFn: () => getUserProfile(user?.uid as string),
      enabled: !!user?.uid,
    });

  const { messages, isLoading } = useChatMessages(chatId);
  const { onSend } = useSendMessage({
    chatId,
    user: currentUserProfile || null,
  });

  if (isLoading || isCurrentUserProfileLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={COLORS.primary}
      />
    );
  }

  return (
    <ChatRoom
      messages={messages}
      onSend={onSend}
      user={{
        _id: user?.uid || "",
      }}
    />
  );
}
