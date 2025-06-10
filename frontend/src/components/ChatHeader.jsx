import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"
import avtar from "/src/assets/avtar.jpg"

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  console.log("selected user----", selectedUser);


  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avtar */}
          <div className="avtar">
            <div className="size-10  relative">
              <img className="rounded-full object-cover" src={selectedUser.profilePic || avtar} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-xs text-base-content/70">{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
          </div>
        </div>
        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader