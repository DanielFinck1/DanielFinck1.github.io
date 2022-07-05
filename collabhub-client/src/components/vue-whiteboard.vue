<template>
  <svg
    ref="container"
    :style="{
      backgroundColor: this.backgroundColor,
    }"
  ></svg>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { curveBasis, drag, line, select } from "d3";

const setLineAttributes = (props) => {
  const styles = Object.assign(
    {},
    {
      fill: "none",
      stroke: props.color,
      "stroke-width": props.size,
      "stroke-linejoin": props.linejoin,
      "stroke-linecap": props.linecap,
    },
    props.lineStyles
  );
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
};

const getCoordinates = (event) => {
  const {
    sourceEvent: { offsetX, offsetY },
  } = event;
  return [offsetX, offsetY];
};

const clearSvg = (container) => container.selectAll("*").remove();

const drawLine = (container, node) => container.node().appendChild(node);

const undoAction = (state) => {
  if (!state.undoStack.length) return;
  state.redoStack.push(state.undoStack.pop());
  clearSvg(state.svg);
  state.undoStack.forEach((node) => drawLine(state.svg, node));
};

const redoAction = (state) => {
  if (!state.redoStack.length) return;
  state.undoStack.push(state.redoStack.pop());
  clearSvg(state.svg);
  state.undoStack.forEach((node) => drawLine(state.svg, node));
};

export default {
  name: "VueWhiteboard",
  data() {
    return {
      context: {},
    };
  },

  props: {
    color: {
      type: String,
      default: "#333333",
    },
    backgroundColor: {
      type: String,
      default: "#010001",
    },
    lineStyles: {
      type: Object,
      default: () => {},
    },
    size: {
      type: String,
      default: "5px",
    },
    linejoin: {
      type: String,
      default: "round",
      validator: (val) =>
        ["miter", "round", "bevel", "miter-clip", "arcs"].includes(val),
    },
    linecap: {
      type: String,
      default: "round",
      validator: (val) => ["butt", "square", "round"].includes(val),
    },
  },
  setup(props, { emit }) {
    const d3Line = line().curve(curveBasis);
    const state = reactive({
      container: null,
      svg: null,
      activeLine: null,
      network_line: null,
      undoStack: [],
      redoStack: [],
    });

    const init = () => {
      state.svg = select(state.container).call(
        drag()
          .container(state.container)
          .subject(({ x, y }) => [
            [x, y],
            [x, y],
          ])
          .on("start", (event) => {
            state.activeLine = state.svg
              .append("path")
              .datum(event.subject)
              .attr("class", "line")
              .attr("style", setLineAttributes(props));
            state.activeLine.attr("d", d3Line);
            emit("dragstart", {
              coordinates: getCoordinates(event),
              node: state.activeLine.node(),
              options: Object.assign({}, props),
            });

            event.on("drag", (event) => {
              const coordinates = [event.x, event.y];
              state.activeLine.datum().push(coordinates);
              state.activeLine.attr("d", d3Line);
              emit("drag", {
                coordinates,
                node: state.activeLine.node(),
                options: Object.assign({}, props),
              });
            });
            event.on("end", (event) => {
              state.activeLine.attr("d", d3Line);
              const node = state.activeLine.node();
              state.undoStack.push(node);
              emit("dragend", {
                coordinates: [event.x, event.y],
                node,
                options: Object.assign({}, props),
              });
            });
          })
      );

      emit("init", state.svg);
    };

    const undo = () => {
      undoAction(state);
      emit("undo");
    };

    const redo = () => {
      redoAction(state);
      emit("redo");
    };

    const clear = () => {
      clearSvg(state.svg);
      state.undoStack = [];
      state.redoStack = [];
      emit("clear");
    };

    const simulate_start = () => {
      state.network_line = state.svg
        .append("path")
        .datum([])
        .attr("class", "line")
        .attr("style", setLineAttributes(props));
      state.network_line.attr("d", d3Line);
    };

    const simulate_drag = (event) => {
      const coordinates = event.coordinates;
      state.network_line.datum().push(coordinates);
      state.network_line.attr("d", d3Line);
    };

    const simulate_end = (event) => {
      const coordinates = event.coordinates;
      state.network_line.datum().push(coordinates);
      state.network_line.attr("d", d3Line);
      const node = state.network_line.node();
      state.undoStack.push(node);
    };

    const simulate_undo = () => {
      undoAction(state);
    };

    const simulate_redo = () => {
      redoAction(state);
    };

    const simulate_clear = () => {
      clearSvg(state.svg);
      state.undoStack = [];
      state.redoStack = [];
    };

    const get_state = () => {
      return state;
    };

    const get_latest_board = (latest_state) => {
      for (var i = 0; i < latest_state.undoStack.length; i++) {
        const coord = latest_state.undoStack[i].__data__;
        state.network_line = state.svg
          .append("path")
          .datum([
            [coord[0][0], coord[0][1]],
            [coord[0][0], coord[0][1]],
          ])
          .attr("class", "line")
          .attr("style", setLineAttributes(props));
        state.network_line.attr("d", d3Line);
        for (var j = 1; j < latest_state.undoStack[i].__data__.length; j++) {
          const coordinates = [coord[j][0], coord[j][1]];
          state.network_line.datum().push(coordinates);
          state.network_line.attr("d", d3Line);
        }
        state.network_line.attr("d", d3Line);
        const node = state.network_line.node();
        state.undoStack.push(node);
      }
    };

    onMounted(init);

    return {
      ...toRefs(state),
      undo,
      redo,
      clear,
      simulate_start,
      simulate_drag,
      simulate_end,
      simulate_undo,
      simulate_redo,
      simulate_clear,
      get_state,
      get_latest_board,
    };
  },
};
</script>
