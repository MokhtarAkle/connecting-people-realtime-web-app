// Description: This file is the entry point for the application

// Importing the required modules
const express = require("express");
const socketio = require("socket.io");

const path = require("path");

const http = require("http");
const session = require("express-session");

//creating an express app
const app = express();

//setting the public folder as the static folder
app.use(express.static(path.join(__dirname, "public")));

//session configuration
const sessionMiddleware = session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        //set expiry time for session to 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
});

//creating a server
const server = http.createServer(app);
const io = socketio(server);

//using the session middleware
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

//listening for user connection
io.on("connection", (socket) => {
    console.log("a user connected");
//More Code To Be Added Here
});

//starting the server
server.listen(3000, () => {
    console.log("listening on *:3000");
});
