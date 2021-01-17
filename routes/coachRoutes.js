const express = require('express')
const { result } = require('lodash')
const router = express.Router()

const Coach = require('../controler/coach')
const { route } = require('./location_routes')
const coach = new Coach()

router.get('/', (req, res) => {
    console.log("indie get coachS")
    coach.findAll()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(500).json(new Error(error))
        })
})

router.get('/:id', (req, res) => {
    let id = req.params["id"]
    console.log("indie get coachS", id)
    coach.findOne(id)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            res.status(500).json(new Error(error))
        })
})


router.put('/update', (req, res) => {
    let body = req.body
    let coachId = req.query["coachId"]
    console.log(coachId)
    console.log(body)
    coach.update(body, coachId)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json(new Error(err))
        })
})

router.post('/add', (req, res) => {
    let body = req.body
    coach.create(body)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json(new Error(err))
        })
})


router.put('/remove', (req, res) => {
    let id = req.query['id']
    coach.remove(id)
    .then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.status(500).json({
            err : err.message
        })
    })
})


module.exports = router