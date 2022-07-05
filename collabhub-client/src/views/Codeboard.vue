const { shallowRef } = require("vue")

<script>
import { Codemirror } from "vue-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { reactive, computed, shallowRef } from "vue";
import { EditorState } from "@codemirror/state";

const themes = { oneDark };
const languages = {
  Python: python(),
  "C++": cpp(),
  Java: java(),
  JavaScript: javascript(),
};

var code = shallowRef(EditorState.doc);

const state = reactive({
  language: "Python",
  theme: "oneDark",
});

const extensions = computed(() => {
  const result = [];
  result.push(languages[state.language]);
  if (themes[state.theme]) {
    result.push(themes[state.theme]);
  }
  return result;
});

export default {
  components: {
    Codemirror,
  },
  data: () => ({
    isConnected: false,
    myStyle: {
      backgroundColor: "#0d1117",
    },
  }),
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    codeboard_relay(data) {
      this.code = data;
    },
    language_relay(lang) {
      state.language = lang;
    },
    broadcast(data) {
      if (data[0] !== null) {
        this.code = data[0];
      }
      if (data[1] !== null) {
        state.language = data[1];
      }
    },
  },
  methods: {
    codeboard_update(event) {
      this.$socket.emit("codeboard_update", event);
    },
    update_language(lang) {
      this.$socket.emit("update_language", lang);
    },
    onCodeMirrorReady(codeMirror) {
      // Save CodeMirror instance
      // console.log("Ready")
      this.codeMirror = codeMirror;
      // console.log(this.codeMirror.state.doc)
    },
  },
  setup() {
    return {
      extensions,
      state,
      code,
      log: console.log,
    };
  },
};
</script>

<template>
  <div :style="myStyle">
    <div>
      <select
        v-model="state.language"
        class="btn-secondary"
        value="Python"
        @change="update_language(state.language)"
      >
        <option value="Python">Python</option>
        <option value="C++">C++</option>
        <option value="Java">Java</option>
        <option value="JavaScript">JavaScript</option>
      </select>
    </div>
    <codemirror
      v-model="code"
      placeholder=""
      :style="{ height: 'calc(100vh - 40px)' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="onCodeMirrorReady"
      @change="codeboard_update($event)"
      @focus="log('focus', $event)"
      @blur="log('blur', $event)"
    />
  </div>
</template>

<style scoped>
.btn-secondary:disabled,
.btn-secondary:disabled:hover,
.btn-secondary:disabled:active,
.btn-secondary:disabled:hover:active,
.btn-secondary {
  width: 140px;
  height: 40px;
  border: none;
  text-align: center;
  background-color: #292d34;
}

p {
  margin-bottom: 0px;
}
</style>
