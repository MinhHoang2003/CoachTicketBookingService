const express = require('express')
const { result } = require('lodash')
const Route = require('../controler/route')
const router = express.Router()

const route = new Route()

router.get('/search', (req, res) => {
    let pickLocation = req.query["pick_location"]
    let destination = req.query['destination']
    let date = req.query['date']

    console.log(pickLocation, destination, date)
    route.find(pickLocation, destination, date)
        .then(result => {
            res.json(result)
        })
})

router.get('/position', (req, res) => {
    let route_id = req.query["route_id"]
    let date = req.query["date"]

    route.getPosition(route_id, date)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            const errorMessage = {
                err: err
            }
            res.json(errorMessage)
        })
})

router.post('/', (req, res) => {
    const router = {
        name: req.body.name,
        coach_id: req.body.coach_id,
        start_time: req.body.start_time,
        estimate_end_time: req.body.estimate_end_time,
        stop_station: req.body.stop_station
    }
    route.create(router)
        .then((result) => {
            console.log('Post request: ', result)
        })
        .catch((error) => {
            console.log('Error : Post new company : ', error)
        })
})

module.exports = router