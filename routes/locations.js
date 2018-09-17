'use strict'

const express = require('express')
const crudRepository = require('../database/crudrepository.js')

let locations = express.Router()

locations.get('/', (req, res) => {
  crudRepository.findAll((result) => res.send(result))
})

locations.get('/:urlId([1-9]+)', (req, res) => {
  const urlId = Number(req.params.urlId)
  crudRepository.findById(urlId, (result) => res.send(result), 
    () => res.status(404).send({"error": "Can't find with given id."}) )
})

locations.post('/', (req, res) => {
  let location = {"lat": req.body.lat, "lon": req.body.lon}
  crudRepository.save(location, (idNumber) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + idNumber;
    res.location(fullUrl)
    res.status(201)
    res.end()
  })
})

locations.delete('/:urlId([1-9]+)', (req, res) => {
  const urlId = Number(req.params.urlId)
  crudRepository.deleteById(urlId, () => {
      res.status(200).send({ 'status': 'deleted' })
  }, () => res.status(404).send({"error": "Can't find with given id."}))
})

module.exports = locations