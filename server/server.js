const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 6001;

const code_board = {
  code: null,
  language: null,
};
const doodle_board = {
  state: null,
  color: null,
  size: null,
};

io.on('connection', (socket) =>
{
  io.emit("broadcast", code_board.code, code_board.language,
    doodle_board.state, doodle_board.color, doodle_board.size);
  console.log('user connected ' + socket.id);

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });


  // codeboard
  socket.on('codeboard_update', function (code) {
    code_board.code = code;
    socket.broadcast.emit("codeboard_relay", code);
  });
  socket.on('update_language', function (lang) {
    code_board.language = lang;
    socket.broadcast.emit("language_relay", lang);
  });

  // doodleboard
  socket.on('whiteboard_dragstart', function () {
    socket.broadcast.emit("whiteboard_dragstart_relay");
  });
  socket.on('whiteboard_drag', function (event) {
    socket.broadcast.emit("whiteboard_drag_relay", event);
  });
  socket.on('whiteboard_dragend', function (event, state) {
    doodle_board.state = state;
    socket.broadcast.emit("whiteboard_dragend_relay", event);
  });
  socket.on('whiteboard_undo', function (event, state) {
    doodle_board.state = state;
    socket.broadcast.emit("whiteboard_undo_relay");
  });
  socket.on('whiteboard_redo', function (event, state) {
    doodle_board.state = state;
    socket.broadcast.emit("whiteboard_redo_relay");
  });
  socket.on('whiteboard_clear', function (event, state) {
    doodle_board.state = state;
    socket.broadcast.emit("whiteboard_clear_relay");
  });
  socket.on('update_color', function (color) {
    doodle_board.color = color;
    socket.broadcast.emit("update_color_relay", color);
  });
  socket.on('update_size', function (size) {
    doodle_board.size = size;
    socket.broadcast.emit("update_size_relay", size);
  });
})

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
