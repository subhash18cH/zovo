import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";

export const useAuthStore=create( (set) => ( {
  authUser:null,
  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,
  isCheckingAuth:true,

  checkAuth: async()=>{
    try {
      const res= await api.get("/auth/check");
      set({authUser:res.data});
      
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
  }
  
} ) ) 