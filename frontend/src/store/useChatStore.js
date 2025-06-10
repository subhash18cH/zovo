import {create} from "zustand";
import api from "../libs/Api";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore=create((set,get)=>({
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
  sendMessage:async(messageData)=>{
    const {selectedUser,messages}=get();
    try {
      const res=await api.post(`/message/send/${selectedUser._id}`,messageData);
      if(res.status===200){
        set({messages:[...messages,res.data]});
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages:()=>{
    const {selectedUser}=get();
    if(!selectedUser) return;

    const socket=useAuthStore.getState().socket;
    const{authUser}=useAuthStore.getState();
    if (!socket || !selectedUser || !authUser) return;

    socket.off("newMessage");
    socket.on("newMessage",(newMessage)=>{
       const isPartOfCurrentChat = 
      (newMessage.senderId === authUser.userId && newMessage.receiverId === selectedUser._id) ||
      (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser.userId);
    
    if (!isPartOfCurrentChat) return;
      set({messages:[...get().messages,newMessage]});
    })
    
  },

  unsubscribeFromMessages:()=>{
     const socket=useAuthStore.getState().socket;
     socket.off("newMessage");
  },

  setSelectedUser:(selectedUser)=>set({selectedUser})
}))