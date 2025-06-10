import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const baseUrl=import.meta.env.VITE_BASE_URL;
console.log("bbbb--",baseUrl);

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
      console.log("auth user----",res.data);
      
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
      await api.post("/auth/logout");
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
    if(!authUser || get().socket?.connected){
      return;
    }
    const socket=io(baseUrl,{
      query:{
        userId:authUser.userId
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