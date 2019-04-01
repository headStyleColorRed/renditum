import Vue from 'vue'
import Router from 'vue-router'
import landlordHome from './views/landlord/landlordHome.vue'
import alquileres from './views/landlord/alquileres.vue'
import template from './views/landlord/template.vue'
import tenantHome from './views/tenant/tenantHome.vue'
import login from './views/login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/landlordHome',
      name: 'home',
      component: landlordHome
    },
    {
      path: '/alquileres',
      name: 'alquileres',
      component: alquileres
    },
    {
      path: '/template',
      name: 'template',
      component: template
    },
    {
      path: '/tenantHome',
      name: 'home',
      component: tenantHome
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
  ]
})
