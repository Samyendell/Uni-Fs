// import { createRouter, createWebHistory } from 'vue-router';

// import Home from "../Home.vue"
// import Login from "../Login.vue"
// import SingleItem from '../SingleItem.vue';
// import Search from '../Search.vue';

// const ifAuthenticated = (to, from, next) => {
//     const loggedIn = localStorage.getItem('session_token');
//     if (loggedIn) {
//         next()
//     } else {
//         next('/login')
//     }
// }

// const routes = [
//     { path: "/", component: Home },
//     { path: "/login", component: Login },
//     { path: "/item/:id", component: SingleItem },
//     { path: "/search", component: Search}


// ]

// const router = createRouter({
//     history: createWebHistory(),
//     routes,
// })

// export default router;

// import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/pages/Home.vue'
// import Login from '../views/pages/Login.vue'
// import CreateItem from '../views/pages/CreateItem.vue'
// import ItemsView from '../views/pages/ItemsView.vue'
// import ItemDetail from '../views/pages/ItemDetail.vue'
// import Profile from '../views/pages/Profile.vue'
// import Logout from '../views/pages/Logout.vue'

// const routes = [
//   { path: '/', name: 'Home', component: Home },
//   { path: '/login', name: 'Login', component: Login },
//   { path: '/create-item', name: 'CreateItem', component: CreateItem },
//   { path: '/items', name: 'ItemsView', component: ItemsView },
//   { path: '/items/:id', name: 'ItemDetail', component: ItemDetail },
//   { path: '/profile', name: 'Profile', component: Profile },
//   { path: '/logout', name: 'Logout', component: Logout }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router

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