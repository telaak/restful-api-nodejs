'use strict'

const express = require('express')
const cors = require('cors')
const locationRouter = require('./routes/locations.js')

const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http);

const locations = new locationRouter(http, io)
app.use(cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Expose-Headers", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json())
app.use('/locations', locations.router)

app.get('/', function(res, req) {
  res.send("Index test")
})

http.listen(8080, () => {
  console.log(`Listening on port :8080`)
})