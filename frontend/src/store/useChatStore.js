import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    // Check if user is authenticated before making request
    const token = localStorage.getItem("JWT");
    const { authUser } = useAuthStore.getState();
    
    if (!token || !authUser) {
      console.log("No authentication, skipping getUsers");
      return;
    }

    set({ isUsersLoading: true });
    try {
      console.log("Fetching users with token:", token.substring(0, 20) + "...");
      const res = await api.get("/message/users");
      
      if (res.status === 200) {
        set({ users: res.data });
        console.log("Users fetched successfully:", res.data.length);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      
      // Handle 401 specifically
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // Optionally trigger logout
        useAuthStore.getState().logout();
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    const token = localStorage.getItem("JWT");
    const { authUser } = useAuthStore.getState();
    
    if (!token || !authUser) {
      console.log("No authentication, skipping getMessages");
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await api.get(`/message/${userId}`);
      if (res.status === 200) {
        set({ messages: res.data });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        useAuthStore.getState().logout();
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch messages");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const token = localStorage.getItem("JWT");
    const { authUser } = useAuthStore.getState();
    
    if (!token || !authUser || !selectedUser) {
      toast.error("Authentication required");
      return;
    }

    try {
      const res = await api.post(`/message/send/${selectedUser._id}`, messageData);
      if (res.status === 200) {
        set({ messages: [...messages, res.data] });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        useAuthStore.getState().logout();
      } else {
        toast.error(error.response?.data?.message || "Failed to send message");
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();
    if (!socket || !selectedUser || !authUser) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const isPartOfCurrentChat = 
        (newMessage.senderId === authUser.userId && newMessage.receiverId === selectedUser._id) ||
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser.userId);
    
      if (!isPartOfCurrentChat) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser })
}));