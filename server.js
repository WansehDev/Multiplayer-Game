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
const users = [];
const players = [];
app.get("/", function(req, res) {
    res.render("index");
});



io.on("connection", (socket) => {
    console.log("User Connected Count:" , io.engine.clientsCount);
    console.log(socket.id);
    //disconnect users
    
    
    socket.on("disconnect", () => {
        console.log("User Disconnected Count:" , io.engine.clientsCount);
    })

});
