import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Reader from "../views/Reader.vue";
import Compare from "../views/Compare.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/reader",
    name: "Reader",
    component: Reader,
  },
  {
    path: "/compare",
    name: "Compare",
    component: Compare,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
