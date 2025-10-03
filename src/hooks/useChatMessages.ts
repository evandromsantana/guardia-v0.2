import { useEffect, useState } from "react";
import { IMessage } from "react-native-gifted-chat";
import { getMessagesForChat } from "../services/chatService";

export const useChatMessages = (chatId: string | undefined) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = getMessagesForChat(chatId, (messages) => {
        setMessages(messages);
        if (isLoading) setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [chatId, isLoading]);

  return { messages, isLoading };
};
