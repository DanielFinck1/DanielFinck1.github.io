<script>
import VueWhiteboard from "../components/vue-whiteboard";
export default {
  name: "App",
  components: {
    VueWhiteboard,
  },
  data: () => ({
    isConnected: false,
    socketMessage: "",
    color: "#f01414",
    size: "5",
  }),
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    whiteboard_dragstart_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_start();
    },
    whiteboard_drag_relay(event) {
      var wb = this.$refs.whiteboard;
      wb.simulate_drag(event);
    },
    whiteboard_dragend_relay(event) {
      var wb = this.$refs.whiteboard;
      wb.simulate_end(event);
    },
    whiteboard_undo_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_undo();
    },
    whiteboard_redo_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_redo();
    },
    whiteboard_clear_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_clear();
    },
    update_color_relay(c) {
      this.color = c;
    },
    update_size_relay(s) {
      this.size = s;
    },
    broadcast(data) {
      var wb = this.$refs.whiteboard;
      var state = data[2];
      if (state !== null) {
        wb.get_latest_board(data[2]);
      }
      var c = data[3];
      if (c !== null) {
        this.color = c;
      }
      var s = data[4];
      if (s !== null) {
        this.size = s;
      }
    },
  },
  methods: {
    whiteboard_dragstart() {
      this.$socket.emit("whiteboard_dragstart");
    },
    whiteboard_drag(event) {
      this.$socket.emit("whiteboard_drag", event);
    },
    whiteboard_dragend(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_dragend", event, state);
    },
    whiteboard_undo(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_undo", event, state);
    },
    whiteboard_redo(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_redo", event, state);
    },
    whiteboard_clear(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_clear", event, state);
    },
    update_color(c) {
      this.$socket.emit("update_color", c);
    },
    update_size(s) {
      this.$socket.emit("update_size", s);
    },
  },
};
</script>

<style scoped lang="scss">
html,
body,
#app {
  margin: 0;
  height: 100%;
}

.whiteboard {
  border: 1px solid black;
  color: red;
  padding: 5px;
  width: 100%;
  height: 100vh;
  cursor: url("../cursor.svg") 5 5, crosshair;
}

.clear {
  position: relative;
  color: red;
  margin-top: -60px;
  height: 20%;
  width: 7%;
}

.color-picker-container {
  position: relative;
  color: red;
  margin-top: -55px;
}

.size-picker-container {
  position: relative;
  color: red;
  margin-top: -60px;
  height: 40px;
}

.container {
  max-width: 95%;
}
</style>
<template>
  <div>
    <vue-whiteboard
      class="whiteboard"
      :color="color"
      :size="size"
      @dragstart="whiteboard_dragstart()"
      @drag="whiteboard_drag($event)"
      @dragend="whiteboard_dragend($event)"
      @undo="whiteboard_undo($event)"
      @redo="whiteboard_redo($event)"
      @clear="whiteboard_clear($event)"
      ref="whiteboard"
    />
    <div class="container">
      <div class="row">
        <select
          v-model="size"
          class="col-1 btn btn-secondary dropdown-toggle size-picker-container"
          value="5"
          @change="update_size(size)"
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <div
          class="btn btn-outline-primary col-1 clear"
          @click="$refs.whiteboard.clear"
        >
          clear
        </div>
        <div
          class="btn btn-outline-primary col-1 clear"
          @click="$refs.whiteboard.undo"
        >
          undo
        </div>
        <div
          class="btn btn-outline-primary col-1 clear"
          @click="$refs.whiteboard.redo"
        >
          redo
        </div>
        <div class="col-1 color-picker-container">
          <input type="color" v-model="color" @input="update_color(color)" />
        </div>
      </div>
    </div>
  </div>
</template>
