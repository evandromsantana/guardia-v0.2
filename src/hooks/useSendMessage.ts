import { useMutation } from "@tanstack/react-query";
import { IMessage } from "react-native-gifted-chat";
import { sendMessage } from "../src/services/chatService";
import { UserProfile } from "../src/types/user";

interface UseSendMessageProps {
  chatId: string | undefined;
  user: UserProfile | null;
}

export const useSendMessage = ({ chatId, user }: UseSendMessageProps) => {
  const { mutate: send } = useMutation({
    mutationFn: ({ text }: { text: string }) => {
      if (!chatId || !user) throw new Error("Chat ID or user not found");
      return sendMessage(chatId, user.uid, text);
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      // Here you could add UI feedback, like an alert
    },
  });

  const onSend = (newMessages: IMessage[] = []) => {
    const text = newMessages[0].text;
    send({ text });
  };

  return { onSend };
};
