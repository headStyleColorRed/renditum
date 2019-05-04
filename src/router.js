import Vue from 'vue'
import Router from 'vue-router'
import store from "./store.js"

//S H A R E D 
import login from './views/login.vue'
import ultimoPaso from './views/ultimoPaso.vue'

// L A N D L O R D
import landlordHome from './views/landlord/landlordHome.vue'
import alquileres from './views/landlord/alquileres.vue'
import landlordAgenda from './views/landlord/landlordAgenda.vue'
import template from './views/landlord/template.vue'
import newHouse from './views/landlord/newHouse.vue'
import landLordChat from './views/landlord/landLordChat.vue'

//T E N A N T
import tenantHome from './views/tenant/tenantHome.vue'
import arregloTemplate from './views/tenant/arregloTemplate.vue'
import tenantChat from './views/tenant/chat.vue'
import tenantAgenda from './views/tenant/tenantAgenda.vue'
import notificacionTemplate from './views/tenant/notificacionTemplate.vue'
notificacionTemplate
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/ultimoPaso',
      name: 'ultimoPaso',
      component: ultimoPaso
    },
    { path: "*", redirect: "/" },

    // L A N D L O R D   R O U T E S
    {
      path: '/landlordHome',
      name: 'landlordHome',
      component: landlordHome,
      meta: { Auth: true, title: "Home" },
    },
    {
      path: '/alquileres',
      name: 'alquileres',
      component: alquileres
    },
    {
      path: '/landlordAgenda',
      name: 'landlordAgenda',
      component: landlordAgenda,
      meta: { title: "Agenda" },
    },
    {
      path: '/newHouse',
      name: 'newHouse',
      component: newHouse,
      meta: { title: "nuevoAlquiler" },
    },
    {
      path: '/template',
      name: 'template',
      component: template
    },
    {
      path: '/landLordChat',
      name: 'landLordChat',
      component: landLordChat,
    },


    // T E N A N T   R O U T E S
    {
      path: '/tenantHome',
      name: 'home',
      component: tenantHome,
      meta: { Auth: true, title: "Home" },
    },
    {
      path: '/arregloTemplate',
      name: 'arregloTemplate',
      component: arregloTemplate,
    },
    {
      path: '/tenantChat',
      name: 'tenantChat',
      component: tenantChat,
    },
    {
      path: '/tenantAgenda',
      name: 'tenantAgenda',
      component: tenantAgenda,
    },
    {
      path: '/notificacionTemplate',
      name: 'notificacionTemplate',
      component: notificacionTemplate,
    },
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.meta.Auth && !store.state.authModule.logged) {
    next({ path: "/" })
  } else {
    next();
  }
})

export default router;

