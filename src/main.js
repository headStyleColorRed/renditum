import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'
import firebase from "firebase"
import "firebase/firestore";
import firebaseConfig from "./config/firebase.js"

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
