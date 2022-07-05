<template>
  <div :style="myStyle">
    <Sidebar />
    <div :style="{ 'margin-left': sidebarWidth }">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/sidebar/Sidebar";
import { sidebarWidth } from "@/components/sidebar/state";

export default {
  name: "App",
  components: {
    Sidebar,
  },
  data: () => ({
    myStyle: {
      backgroundColor: "#0d1117",
    },
  }),
  setup() {
    return { sidebarWidth };
  },
};
</script>

<style scoped lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
Footer {
  padding: 40px;
  bottom: 0;
  width: 100%;
  height: 2.5rem;
}
</style>
