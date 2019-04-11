import Vue from 'vue'
import Vuex from 'vuex'
import authModule from "./modules/auth.js"
import tenantModule from "./modules/tenantStore.js"
import landlordModule from "./modules/landlordStore.js"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    processing: false,
    loaded: false,
    alquileres: {
      loadIt: true,
    },
  },
  mutations: {
    setAlquileres: (state, alquileres) => {
      state.alquileres = alquileres;
    },
  },
  getters: {
    alquileres: (state) => {
      return state.alquileres;
    },
  },
  modules: {
    authModule,
    tenantModule,
    landlordModule
  }
})
