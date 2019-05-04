import Vue from 'vue'
import Vuex from 'vuex'
import authModule from "./modules/auth.js"
import tenantModule from "./modules/tenantStore.js"
import landlordModule from "./modules/landlordStore.js"
import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
  key: 'my-app',
  storage: localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alquileres: null,
    chatRoom: null,
    profilePic: null,
    documentos: null,
  },
  mutations: {
    setAlquileres: (state, alquileres) => {
      state.alquileres = alquileres;
    },
    setChatRoom: (state, chatRoom) => {
      state.chatRoom = chatRoom;
    },
    setProfilePic: (state, profilePic) => {
      state.profilePic = profilePic;
    },
    setDocumentos: (state, documentos) => {
      state.documentos = documentos;
    },
    resetStoreState(state) {
      state.alquileres = null;
      state.chatRoom = null;
      state.profilePic = null;
      state.documentos = null;
    }
  },
  getters: {
    alquileres: (state) => {
      return state.alquileres;
    },
    chatRoom: (state) => {
      return state.chatRoom;
    },
    profilePic: (state) => {
      return state.profilePic;
    },
    documentos: (state) => {
      return state.documentos;
    },
  },
  modules: {
    authModule,
    tenantModule,
    landlordModule
  },
  plugins: [vuexPersist.plugin],
})
