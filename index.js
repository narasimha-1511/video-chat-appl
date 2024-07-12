const { Server } = require("socket.io");
const app = require("express")();
const Express = require("express");
const server = require("http").createServer(app);
const cors = require("cors");
const path = require("path");

const io = new Server(server, {
  path: "/socket",
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});


app.use(cors());

app.use(Express.static(path.join(path.resolve(), "server/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(path.resolve(), "server", "client", "dist", "index.html")
  );
});


const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

 
  socket.on("disconnect", () => {
    console.log("user disconnected");

    const email = socketIdToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
    }
    socketIdToEmailMap.delete(socket.id);
  });
});

server.listen(5000, () => {
  console.log("listening on *:3001");
});
