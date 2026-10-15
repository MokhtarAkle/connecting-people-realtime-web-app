var express = require('express');
var router = express.Router();
var filters = require('ctc-module');
const fetch = require('node-fetch');
const { getSmartzones } = require('../lib/smartzones');
const chatbot = require('../lib/chatbot');

require('dotenv').config()

const baseurl = `${process.env.API_URL}`;


/* GET home page. */
router.get('/', function(req, res, next) {
  let orderBy = req.query.orderBy || 'publishedAt'
  getSmartzones(orderBy).then((smartzones) => {
    res.render('index', { smartzones })
  }).catch(next);
});

router.get('/filtered', function(req, res, next) {

  getSmartzones().then((smartzones) => {

        res.render('index', {smartzones: filters(req, { smartzones })});

  }).catch(next);
});

// Smartzones for the map markers on the client
router.get('/api/smartzones', function(req, res, next) {
  getSmartzones().then((smartzones) => {
    res.json({ smartzones });
  }).catch(next);
});

// HTTP version of the socket.io chatbot, used where websockets aren't available (Vercel)
router.post('/api/chat', (req, res) => {
  const { message } = req.body;

  if (message === undefined) {
    return res.json({ progress: 0, replies: [chatbot.welcome] });
  }

  const progress = Number(req.body.progress) || 0;
  res.json(chatbot.respond(String(message), progress));
});


router.post('/', (request, response) => {
  request.body.timeStart = request.body.dateStart + 'T' + request.body.timeStart + '+00:00';
  request.body.timeEnd = request.body.dateEnd + 'T' + request.body.timeEnd + '+00:00';
  const url1 = `${baseurl}/reservations`
  postJson(url1, request.body).then((data) => {
    let newReservation = { ... request.body}

    console.log(newReservation);

   if (!data.success) {
    console.error('Reservation failed:', data.message)
   }

    // Always respond, otherwise the request hangs until the serverless function times out
    response.redirect('/')
  })
})




async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000,
  })
    .then((response) => response.json())
    .catch((error) => error)
}

module.exports = router;
