const express = require('express')
const { result } = require('lodash')
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
            res.status = 500
            res.json({
                message: err
            })
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
            res.status = 500
            res.json({
                message: err
            })
        })
})

module.exports = router