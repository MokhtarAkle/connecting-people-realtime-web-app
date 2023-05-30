var express = require('express');
var router = express.Router();
var filters = require('ctc-module');

require('dotenv').config()

const url = `${process.env.API_URL}/smartzones?first=100`;
const baseurl = `${process.env.API_URL}`;


// Description: This file is the entry point for the application


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





/* GET home page. */
router.get('/', function(req, res, next) {
  const { query } = req
  let orderBy = req.query.orderBy || 'publishedAt'
  let smartUrl = url + '?orderBy=' + orderBy + '&direction=ASC' 
  fetchJson(smartUrl).then((data) => {
    res.render('index', data)

});
});

router.get('/filtered', function(req, res, next) {

  fetchJson(url).then((data) => {
    
        res.render('index', {smartzones: filters(req, data)});
        console.log(filters(req, data));

  })
});


router.post('/', (request, response) => {
  request.body.timeStart = request.body.dateStart + 'T' + request.body.timeStart + '+00:00';
  request.body.timeEnd = request.body.dateEnd + 'T' + request.body.timeEnd + '+00:00';    
  const url1 = `${baseurl}/reservations`
  postJson(url1, request.body).then((data) => {
    let newReservation = { ... request.body}

    console.log(newReservation);

   if (data.success) {
        response.redirect('/reservationPosted')


    }
    else {
    const errorMessage = data.message
    const newData = { error: errorMessage, values: newReservation }

    }
  })
})



async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}

async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}

module.exports = router;