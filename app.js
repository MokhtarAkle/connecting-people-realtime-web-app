var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var app = express();
var http = require('http');
var port = process.env.PORT || 3000;
var server = http.createServer(app);
const socketio = require("socket.io");
const session = require("express-session");
const io = socketio(server);

require('dotenv').config()



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', port);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
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

//listening for user connection
io.on("connection", (socket) => {
    console.log("a user connected");
//More Code To Be Added Here
});

server.listen(port, () => {
    console.log('listening on http://localhost:' + port);
  
  });

module.exports = app;
