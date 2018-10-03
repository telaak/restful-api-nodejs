const express = require('express')
const crudRepository = require('../database/crudrepository.js')

class Locations {
  constructor(http, io) {
    this.http = http
    this.io = io
    this.router = express.Router()
    this.router.get('/', (req, res) => {
      crudRepository.findAll((result) => res.send(result))
    })

    this.router.get('/:urlId([1-9]+)', (req, res) => {
      const urlId = Number(req.params.urlId)
      crudRepository.findById(urlId, (result) => res.send(result),
        () => res.status(404).send({ "error": "Can't find with given id." }))
    })

    this.router.post('/', (req, res) => {
      let location = { "lat": req.body.lat, "lon": req.body.lon }
      crudRepository.save(location, (idNumber) => {
        let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + idNumber;
        res.location(fullUrl)
        res.status(201)
        res.end()
        io.emit('newLoc', fullUrl)
      })
    })

    this.router.delete('/:urlId([1-9]+)', (req, res) => {
      const urlId = Number(req.params.urlId)
      crudRepository.deleteById(urlId, () => {
        res.status(204).end()
        io.emit('locDeleted', urlId)
      }, () => res.status(404).send({ "error": "Can't find with given id." }))
    })
  }
}

module.exports = Locations
