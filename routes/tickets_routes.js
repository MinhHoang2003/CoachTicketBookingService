const express = require('express')
const { result } = require('lodash')
const Tickets = require('../models/tickets')
const router = express.Router()

router.get('/', (req, res) => {
    Tickets.find()
        .then((result) => {
            res.status = 200
            res.json(result)
        })
        .catch((error) => {
            console.log('Get all tickets error: ', error)
        })
})

router.post('/', (req, res) => {
    const ticket = {
        main_infomation: req.body.main_infomation,
        price :req.body.price,
        has_paid: req.body.has_paid,
    }
    Tickets.create(ticket)
        .then((result) => {
            console.log('Post request: ', result)
        }) 
        .catch((error) => {
            console.log('Error : Post new ticket : ', error)
        })
})

module.exports = router