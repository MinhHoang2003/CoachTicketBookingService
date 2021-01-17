const express = require('express')
const { result, isDate } = require('lodash')
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
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
})

router.get('/forDriver', (req, res) => {
    let ticketId = req.query["id"]
    let date = req.query["date"]
    ticket.getTicketsForRoute(ticketId, date)
        .then((result) => {
            res.status = 200
            res.json(result)
        })
        .catch((err) => {
            res.status(500).send(new Error(err))
        })
})

router.get('/check', (req, res) => {
    let ticketId = req.query["id"]
    let date = req.query["date"]
    ticket.checkTicket(ticketId, date)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err.message))
        })
})

router.put('/pay', (req, res) => {
    let ticketId = req.query["id"]
    ticket.payTicket(ticketId)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err.message))
        })
})
module.exports = router