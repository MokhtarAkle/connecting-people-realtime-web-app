require('dotenv').config()

var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var app = express();
var http = require('http');
var port = process.env.PORT || 3000;
var server = http.createServer(app);
const socketio = require("socket.io");
const session = require("express-session");
const chatbot = require('./lib/chatbot');
const io = socketio(server);



// socket.io only runs locally, so the client script is only included then (see views/partials/foot.ejs)
app.locals.socketio = !process.env.VERCEL;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', port);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'coding-the-curbs',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        //set expiry time for session to 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
});

//using the session middleware
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

// Vercel runs the app as a serverless function (exported below) and doesn't support websockets,
// so only start the socket.io server when running locally.
if (!process.env.VERCEL) {
  server.listen(port, () => {
    console.log('listening on http://localhost:' + port);

  });
}


//listening for user connection
io.on("connection", (socket) => {
  console.log("a user connected");
//More Code To Be Added Here
const session = socket.request.session;
const sessionId = session.id;

  socket.join(sessionId);
//welcome the user
io.to(sessionId).emit("chat message", {sender: "bot", message: chatbot.welcome});
//a random variable to store the user's progress
let progress = 0
//listen for the chat message event from the client
socket.on("chat message", (message) => {
  //output the user message to the DOM by emitting the chat message event to the client
  io.to(sessionId).emit("chat message", {sender: "user", message});

  const result = chatbot.respond(message, progress);
  progress = result.progress;
  result.replies.forEach((reply) => {
    io.to(sessionId).emit("chat message", {sender: "bot", message: reply});
  });
});
});

module.exports = app;
