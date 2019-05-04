//import firebase from "firebase";

export default {
    state: {
        messages: {},
        chatId: null,
        notificaciones: null,
        notificacionTemplate: null,
        chatRoomAccept: false,

    },
    mutations: {
        setmessages: (state, messages) => {
            state.messages = messages;
        },
        setchatId: (state, chatId) => {
            state.chatId = chatId;
        },
        setNotificaciones: (state, notificaciones) => {
            state.notificaciones = notificaciones;
        },
        setNotificacionTemplate: (state, notificacionTemplate) => {
            state.notificacionTemplate = notificacionTemplate;
        },
        setChatRoomAccept: (state, chatRoomAccept) => {
            state.chatRoomAccept = chatRoomAccept;
        },
        resetTstoreState(state) {
            state.messages = {};
            state.chatId = null;
            state.notificaciones = null;
            state.notificacionTemplate = null;
            state.chatRoomAccept = false;
        }
    },
    getters: {
        messages: (state) => {
            return state.messages;
        },
        notificacionTemplate: (state) => {
            return state.notificacionTemplate;
        },
        chatId: (state) => {
            return state.chatId;
        },
        notificaciones: (state) => {
            return state.notificaciones;
        },
        chatRoomAccept: (state) => {
            return state.chatRoomAccept;
        },
    }
}