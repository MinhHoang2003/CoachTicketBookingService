const express = require('express')
const { result } = require('lodash')
const Position = require('../models/positions')
const router = express.Router()

router.get('/', (req, res) => {
    Position.find()
        .then((result) => {
            res.status = 200
            res.json(result)
        })
        .catch((error) => {
            console.log('Get all companys error: ', error)
        })
})

router.post('/', (req, res) => {
    const company = {
        name: req.body.name,
        description :req.body.description,
        address: req.body.address
    }
    Position.create(company)
        .then((result) => {
            console.log('Post request: ', result)
        })
        .catch((error) => {
            console.log('Error : Post new company : ', error)
        })
})

module.exports = router