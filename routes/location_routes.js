const express = require('express')
const { result } = require('lodash')
const { Error } = require('mongoose')
const Location = require('../controler/location')
const router = express.Router()

const location = new Location()

router.get('/pick', (req, res) => {
    let routeId = req.query["route_id"]
    location.findPickLocation(routeId)
        .then(result => {
            res.status = 200
            res.json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err))
        })
})

router.get('/destination', (req, res) => {
    let routeId = req.query["route_id"]
    location.findDestination(routeId)
        .then(result => {
            res.status = 200
            res.json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err))
        })
})

router.get('/routes/pick', (req, res) => {
    let routeId = req.query["route_id"]
    let date = req.query["date"]

    location.findPickLocationWithTickets(routeId, date)
        .then(result => {
            res.status = 200
            res.json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err))
        })
})


router.get('/routes/destination', (req, res) => {
    let routeId = req.query["route_id"]
    let date = req.query["date"]

    location.findDestinationLocationWithTickets(routeId, date)
        .then(result => {
            res.status = 200
            res.json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err))
        })
})

router.get('/routes/', (req, res) => {
    let routeId = req.query["route_id"]

    location.findAllLocation(routeId)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err))
        })
})

router.get('/:id', (req, res) => {
    let locationId = req.params["id"]
    location.findOne(locationId)
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            console.log("On get location detail err : ", err)
            res.status(500).send(new Error(err))
        })
})

router.put('/update', (req, res, next) => {
    let locationData = req.body

    location.updateLocation(locationData)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log("On update location detail err : ", err)
            res.status(500)
            next(err)
        })
})

router.put('/add', (req, res, next) => {
    let locationData = req.body

    console.log("location data : ", locationData)
    location.addLocation(locationData)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log("On add location detail err : ", err)
            res.status(500)
            next(err)
        })
})

router.put('/remove', (req, res) => {
    let id = req.query['id']

    location.remove(id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new Error(err.message))
        })
})

module.exports = router