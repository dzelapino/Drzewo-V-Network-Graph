import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import PrivateView from '../views/PrivateView.vue'
import TreeView from '../views/TreeView.vue'
import UserListView from '../views/UserListView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import RegisterView from '../views/RegisterView.vue'
import NotFoundView from '../views/NotFoundView.vue'

import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/private',
    name: 'private',
    component: PrivateView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tree',
    name: 'tree',
    component: TreeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/userList',
    name: 'userList',
    component: UserListView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: 'notfound',
    component: NotFoundView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.authorized) {
    next("/login")
  } else {
    next()
  }
})


export default router
