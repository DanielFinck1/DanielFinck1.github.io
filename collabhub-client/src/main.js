import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "@fortawesome/fontawesome-free/js/all";

const io = SocketIO("http://localhost:6001");

var Vue = createApp(App);
Vue.use(router).mount("#app");
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io,
  })
);
