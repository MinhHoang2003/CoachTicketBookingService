const express = require('express')
const { result } = require('lodash')
const Ticket = require('../controler/ticket')
const router = express.Router()

const ticket = new Ticket()

router.get('', (req, res) => {
    let phoneNumber = req.query["phone_number"]
    ticket.getTickets(phoneNumber)
        .then((result) => {
            res.status = 200
            res.json(result)
        })
        .catch((error) => {
            console.log('Get all tickets error: ', error)
        })
})

router.get('/detail', (req, res) => {
    let ticketId = req.query["id"]
    ticket.getTicketDetail(ticketId)
        .then((result) => {
            res.status = 200
            res.json(result)
        })
        .catch((err) => {
            console.log('Get ticket detail : ', err)
        })
})

router.post('/', (req, res) => {
    ticket.requestTicket(req.body)
        .then(result => {
            res.status = 200
            res.json(result)
        })
        .catch(err => {
            res.status = 500
            res.json(err)
        })
})

module.exports = router