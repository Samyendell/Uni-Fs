import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/pages/Home.vue'
import Login from '../views/pages/Login.vue'
import CreateItem from '../views/pages/CreateItem.vue'
import ItemsView from '../views/pages/ItemsView.vue'
import SingleItem from '../views/pages/SingleItem.vue'
import Profile from '../views/pages/Profile.vue'
import Logout from '../views/pages/Logout.vue'
import Register from '../views/pages/Register.vue'


const ifAuthenticated = (to, from, next) => {
  const loggedIn = localStorage.getItem('session_token')
  if (loggedIn) {
    next()
  } else {
    next('/login')
  }
}

const ifNotAuthenticated = (to, from, next) => {
  const loggedIn = localStorage.getItem('session_token')
  if (!loggedIn) {
    next()
  } else {
    next('/')
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/create-item',
    name: 'CreateItem',
    component: CreateItem,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/items',
    name: 'ItemsView',
    component: ItemsView
  },
  {
    path: '/items/:id',
    name: 'SingleItem',
    component: SingleItem
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    beforeEnter: ifAuthenticated
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router