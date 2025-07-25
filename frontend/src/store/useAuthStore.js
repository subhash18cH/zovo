// Fixed useAuthStore.js
import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("JWT");
      if (!token) {
        set({ authUser: null, isCheckingAuth: false });
        return;
      }

      const res = await api.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Auth check failed:", error);
      // Clear invalid token
      localStorage.removeItem("JWT");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      if (res.status === 201) {
        toast.success("Account created successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      if (res.status === 200) {
        localStorage.setItem("JWT", res.data.token);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        
        // Connect socket after setting auth user
        setTimeout(() => {
          get().connectSocket();
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("JWT");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Logout failed");
      console.log(error);
      
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      if (res.status === 200) {
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    const token = localStorage.getItem("JWT");
    
    if (!authUser || !token || get().socket?.connected) {
      return;
    }
    
    console.log("Connecting socket for user:", authUser.email);
    
    const socket = io(baseUrl, {
      auth: {
        token: token
      }
    });
    
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));