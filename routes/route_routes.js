const express = require('express')
const { result } = require('lodash')
const { Error } = require('mongoose')
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
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err))
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

router.put('/:id', (req, res) => {
    let id = req.params["id"]
    route.update(req.body, id)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json(new Error(error))
        })
})

router.get('/get', (req, res) => {
    let phoneNumber = req.query["phone_number"]
    let date = req.query["date"]
    route.getRoutesForDriver(phoneNumber, date)
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            res.status(404).send(new Error(err))
        })

})

router.get('/', (req, res) => {
    route.findAll()
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            console.log(err)
            res.status(500).send(new Error(err))
        })
})


router.get('/:id', (req, res) => {
    let id = req.params["id"]
    route.finById(id)
        .then(result => {
            res.status(200).send(result)
        }).catch(err => {
            res.status(500).send(new Error(err))
        })
})

router.post('/add', (req, res) => {
    route.add(req.body)
        .then(result => {
            res.status(200).send("" + result.insertId)
        }).catch(err => {
            res.status(500).send(new Error(err))
        })
})

router.post('/remove', (req, res) => {
    let id = req.query["id"]
    route.remove(id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err))
        })
})

module.exports = router