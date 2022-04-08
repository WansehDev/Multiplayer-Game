const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

const server = app.listen(1337);
const io = require("socket.io")(server);
let score = 0;
let allUsers = [];
let pos = null;

io.on("connection", (socket) => {
  console.log("User Connected Count:", io.engine.clientsCount);

  socket.on("newPlayer", (data) => {
    allUsers.push(data.newPlayer);
    io.emit("displayActiveUsers", { users: allUsers });
  });

  io.emit("displayActiveUsers", { users: allUsers });

  socket.on("updateScore", (data) => {
    console.log("updateScore", data);
    score = data.score;
    for (let users of allUsers) {
        if (users.id === data.id) {
            users.score = data.score;
        }
        // score if 10000
        if (users.score === 10000) {
            io.emit("winner" , { winnerUser : users});
            break;
        }
    }
    io.emit("displayScore", { users: allUsers });
  });
  io.emit("displayScore", { users: allUsers });

  socket.on("disconnect", () => {
    console.log("User Disconnected Count:", io.engine.clientsCount);
    allUsers.pop();
    io.emit("displayActiveUsers", { users: allUsers });
  });
  
});
app.get("/", function (req, res) {
  res.render("index");
});
