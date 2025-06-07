import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";

export const useChatStore=create((set)=>({
  messages:[],
  users:[],
  selectedUser:null,
  isUsersLoading:false,
  isMessagesLoading:false,

  getUsers: async()=>{
    set({isUsersLoading:true});
    try {
      const res=await api.get("/message/users");
      if(res.status===200){
        set({users:res.data});
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isUsersLoading:false});
    }
  },
  getMessages: async(userId)=>{
    set({isMessagesLoading:true});
    try {
      const res=await api.get(`/message/${userId}`);
      if(res.status===200){
        set({messages:res.data});
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isMessagesLoading:false});
    }
  },
  //todo optimize this later
  setSelectedUser:(selectedUser)=>set({selectedUser})
}))