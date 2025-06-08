import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader"
import MessageSkeleton from "../components/skeletons/MessageSkeleton";

const ChatContainer = () => {
  const { messages, selectedUser, isMessagesLoading, getMessages } = useChatStore();

  useEffect(() => {
    return () => {
      getMessages(selectedUser._id)
    };
  }, [selectedUser._id, getMessages])
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <p>messages...</p>

      <MessageInput />
    </div>
  )
}

export default ChatContainer;