import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Professor/ProfileView.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/Professor/CalendarView.vue')
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/Professor/CoursesView.vue')
  },
  {
    path: '/',
    name: 'sign-on',
    component: () => import('../views/Professor/SignOnView.vue')
  },

  //ADMINISTRADOR
  {
    path: '/admin-sign-on',
    name: 'admin-sign-on',
    component: () => import('../views/Administrator/AdminSignOnView.vue')
  },
  {
    path: '/admin-calendar',
    name: 'admin-calendar',
    component: () => import('../views/Administrator/AdminCalendarView.vue')
  },
  {
    path: '/admin-profile',
    name: 'admin-profile',
    component: () => import('../views/Administrator/AdminProfileView.vue')
  },

  {
    path: '/admin-gestion',
    name: 'admin-gestion',
    component: () => import('../views/Administrator/AdminGestionView.vue')
  },

  
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
