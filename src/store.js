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
  },
  mutations: {
  },
  modules: {
    authModule,
    tenantModule,
    landlordModule
  }
})
