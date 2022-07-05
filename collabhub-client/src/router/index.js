import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Whiteboard from "../views/Whiteboard.vue";
import Codeboard from "../views/Codeboard.vue";
import Video from "../views/Video.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/whiteboard",
    name: "Whiteboard",
    component: Whiteboard,
  },
  {
    path: "/codeboard",
    name: "Codeboard",
    component: Codeboard,
  },
  {
    path: "/video",
    name: "Video",
    component: Video,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
