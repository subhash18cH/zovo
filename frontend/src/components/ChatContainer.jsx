import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader"
import MessageSkeleton from "../components/skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import avtar from "/src/assets/avtar.jpg";
import { formatMessageTime } from "../libs/utils";

const ChatContainer = () => {
  const { messages, selectedUser, isMessagesLoading, getMessages, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null)

  console.log("messages----", messages);

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, unsubscribeFromMessages, subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

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

      <div className=" flex-1  overflow-y-auto p-4 space-y-4">

        {messages.map((message) => (

          <div key={message._id} ref={messageEndRef}

            className={`chat ${message.senderId === authUser.userId ? "chat-end" : "chat-start"}`}>

            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={`${message.senderId === authUser.userId ? authUser.profilePic || avtar : selectedUser.profilePic || avtar}`} alt="profile-pic" />
              </div>
            </div>

            <div className={`chat-bubble flex flex-col gap-2`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md"
                />
              )}

              <div className="flex items-end justify-between gap-2">
                <div className="flex-1">
                  {typeof message.text === 'string' && message.text.trim() !== "" && (
                    <p className="break-words">{message.text}</p>
                  )}
                </div>
                <time className="text-xs opacity-50 whitespace-nowrap self-end flex-shrink-0">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>

          </div>
        ))}

      </div>

      <MessageInput />

    </div >
  )
}

export default ChatContainer;