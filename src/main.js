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
import VueChatScroll from 'vue-chat-scroll'
import vuescroll from 'vue-scroll'

Vue.use(vuescroll)
Vue.use(VueChatScroll)
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    //Control loggins
    if (store.state.authModule.logged) {
      console.log("estás logeado");
      if (store.state.authModule.role === "arrendatario") {
        router.push("/tenantHome");
      } else {
        router.push("/landlordHome");
      }
    } else {
      console.log("no estás logeado");
      router.push("/")
    }
  }
}).$mount('#app')
