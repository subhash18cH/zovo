import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";

export const useAuthStore=create( (set) => ( {
  authUser:null,
  isSigningUp:false,
  isLoggingUp:false,
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

  
} ) ) 