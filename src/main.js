import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Admin from "./views/Admin.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("adminAuthToken");
  const hasToken = Boolean(token && token.trim());

  if (to.meta.requiresAuth && !hasToken) {
    next({ name: "login" });
  } else if (to.name === "login" && hasToken) {
    next({ name: "admin" });
  } else {
    next();
  }
});

createApp(App)
  .use(router)
  .mount("#app");
