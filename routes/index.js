var express = require('express');
var router = express.Router();
var filters = require('ctc-module');
const fetch = require('node-fetch');

require('dotenv').config()

const url = `${process.env.API_URL}/smartzones?first=100`;
const baseurl = `${process.env.API_URL}`;


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