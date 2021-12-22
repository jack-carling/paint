import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Projects from '../views/Projects.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/projects', component: Projects },
  { path: '/:id', component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
