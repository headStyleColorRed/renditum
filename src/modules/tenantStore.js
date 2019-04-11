//import firebase from "firebase";
import dataBase from "../assets/database/tenantPisos.json"

export default {
    state:{
      messages: {},
      chatId: "",
    },
    mutations:{
      setmessages: (state, messages) =>{
          state.messages = messages;
      },
      setchatId: (state, chatId) =>{
          state.chatId = chatId;
      }
    },
    getters:{
      messages: (state) =>{
          return state.messages;
      },
      chatId: (state) =>{
          return state.chatId;
      },
    }
}