import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home.vue'
import login from './views/login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
  ]
})
