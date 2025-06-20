import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const baseUrl=import.meta.env.VITE_BASE_URL;

export const useAuthStore=create( (set,get) => ( {
  authUser:null,
  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,
  isCheckingAuth:true,
  onlineUsers:[],
  socket:null,

  checkAuth: async()=>{
    try {
      const res= await api.get("/auth/check");
      set({authUser:res.data});
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({authUser:null});
    }finally{
      set({isCheckingAuth:false})
    }
  },

  signup: async(data)=>{
    set({isSigningUp:true})
    try {
      const res=await api.post("/auth/signup",data);
      if(res.status===201){
        toast.success("Account create Successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }finally{
      set({isSigningUp:false})
    }
  },

  login:async(data)=>{
    set({isLoggingIn:true});
    try {
      const res=await api.post("/auth/login",data);
      if(res.status===200){
        localStorage.setItem("JWT",res.data.token);
        set({authUser:res.data});
        toast.success("Logged in successfully");
        get().connectSocket()
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isLoggingIn:false})
    }
  },

  logout: async()=>{
    try {
      localStorage.clear();
      set({authUser:null});
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async(data)=>{
    set({isUpdatingProfile:true});
    try {
      const res= await api.put("/auth/update-profile",data);
      if(res.status===200){
        set({authUser:res.data});
        toast.success("profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isUpdatingProfile:false});
    }
  },

  connectSocket:()=>{
    const {authUser}=get();
    if(!authUser || !authUser.userId || get().socket?.connected){
      return;
    }
    console.log("auth user==-",authUser);
    
    const socket=io(baseUrl,{
     auth: {
      token: localStorage.getItem("JWT")
      } 
    });
    socket.connect();

    set({socket:socket});

    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds})
    })
  },

  disconnectSocket:()=>{
    if(get().socket?.connected){
      get().socket.disconnect();
    }
  },
} ) ) 