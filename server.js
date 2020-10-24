const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;

const io = require("socket.io")(server);

server.listen(port, () => {
  console.log("listening!");
});

app.use(express.static("public"));

let numGuests = 0;
let lastData = "oscillate";

io.on("connection", socket => {
  numGuests++;
  console.log(`you are ${numGuests}th guest!`);
  socket.emit("func", lastData);

  socket.emit("hello", { numGuests: numGuests });
  socket.broadcast.emit("hello", { numGuests: numGuests });

  socket.on("func", function(data) {
    lastData = data;
    console.log(data);
    socket.broadcast.emit("func", data);
  });
});
console.log("hello node.js!");
