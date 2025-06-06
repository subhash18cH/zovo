import {create} from "zustand";
import api from "../libs/Api";

export const useAuthStore=create( (set) => ( {
  authUser:null,
  isSigningUp:false,
  isLoggingUp:false,
  isUpdatingProfile:false,

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

  isCheckingAuth:true
} ) ) 