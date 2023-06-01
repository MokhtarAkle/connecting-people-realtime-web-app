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

server.listen(port, () => {
    console.log('listening on http://localhost:' + port);
  
  });


//listening for user connection
io.on("connection", (socket) => {
  console.log("a user connected");
//More Code To Be Added Here
const session = socket.request.session;
const sessionId = session.id;

  socket.join(sessionId);
//welcome the user
io.to(sessionId).emit("chat message", {sender: "bot", message: "Welcome to the Coding the curbs support app, say hello to the bot!"});
//a random variable to store the user's progress
let progress = 0
//listen for the chat message event from the client
socket.on("chat message", (message) => {
  let botresponse = "";

  //output the user message to the DOM by emitting the chat message event to the client
  io.to(sessionId).emit("chat message", {sender: "user", message});
   //logic to check the user's progress
  switch(progress){
    case 0:
      //if the user replies, increase the progress and send the default message
      io.to(sessionId).emit("chat message", {sender: "bot", message:`Press any of the following keys to interact with our bot and choose the most relevant topic to your issue: <br>
  1. Frequently asked questions <br>
  2. Contact support <br>
  3. Report an app error <br>
  4. Live support chat <br>`});
      progress = 1;
      break;
    case 1:
      //the user has selected an option, so we check which option they selected
      if(message === "1"){
        botresponse = "You selected option 1 <br> Frequently asked questions: <br> 1. How do I use the application? <br> 2. How do I control the map? <br> 3. Why is the site asking for my location? <br> 4. None of the above (Contact support) <br> Press any other key to return to previous screen";
        progress = 2;
      }else if(message === "2"){
        botresponse = 'You selected option 2 <br> Contact support: <br> You can contact our support team <a href="https:/www.codingthecurbs.com/contact">here</a> <br> Press any other key to return to previous screen';
        progress = 0;
      }else if (message === "3"){
        botresponse = 'You selected option 3 <br> Report an app error: <br> You can find this project on gitHub and report any problems you encounter <a href="https://github.com/MokhtarAkle/connecting-people-realtime-web-app/issues">here</a> <br> Press any other key to return to previous screen';
      progress = 0;
      }else if(message === "4"){
        botresponse = "You selected option 4 <br> Live support chat: WIP <br> Press any other key to return to previous screen";
        progress = 0;
      }else if(message === "5"){
        botresponse = "You selected option 5 <br> Return to previous screen <br> Press any other key to return to previous screen";
        progress = 0;
      }else{
        //if the user enters an invalid option, we send the default message
        botresponse = "Invalid option <br> Press any of the following keys: <br> 1. Frequently asked questions: <br> 2. Contact support: <br> 3. Report an app error: <br> 4. Live support chat <br>";
//set the progess as 1 until the proper input is recieved
        progress = 1;
        io.to(sessionId).emit("chat message", {sender: "bot", message: botresponse});
        return
      }
      io.to(sessionId).emit("chat message", {sender: "bot", message: botresponse});
      //reset the progress
      break;

      case 2:
        if(message === "1"){
          botresponse = "Q: How do I use the application? <br> A: For general instructions on available functions and controls, refer to: <a href='https://github.com/MokhtarAkle/connecting-people-realtime-web-app'>gitHub readme</a>";
          progress = 1;
        }else if(message === "2"){
          botresponse = "Q: How do I control the map? <br> A: The map used by this application makes use of the Google maps API. For any questions regarding controls and/or functions of the map, refer to: <a href='https://support.google.com/maps/?hl=en#topic=3092425'>Google Maps support</a>";
          progress = 1;
        }else if(message === "3"){
          botresponse = "Q: Why is the site asking for my location? <br> A: The site uses the geolocation API to ping your location and display it on the map as a point of reference. If you don't want to share your location data you can deny the question and still make use of the application freely.";
          progress = 1;
        }else if(message === "4"){
          botresponse = "Q: None of the above (Contact support) <br> A: If your question could not be answered or you have further questions, you can contact the official Coding the Curbs support team: <a href='https://www.codingthecurbs.com/contact'>Here</a> ";
          progress = 1;
        }
        else{
          progress = 0;
          return
        }

        io.to(sessionId).emit("chat message", {sender: "bot", message: botresponse});
        io.to(sessionId).emit("chat message", {sender: "bot", message: `Press 1 to return to previous screen`});

    break;
  }
});
});

module.exports = app;
