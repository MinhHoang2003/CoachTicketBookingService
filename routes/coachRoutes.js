const express = require('express')
const { result } = require('lodash')
const router = express.Router()


const Coach = require('../models/coach')


router.get('/', (req, res) => {
    Coach.find()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            console.log('Error: get coachs: ', error)
            res.status(500).json({
                error: error
            })
        })
})

router.post('/', (req, res) => {
    const coach = {
        _id: 444333,
        company_id: '5f78066bd458d70470c3bbdc',
        number_position: 4,
        driver_id: 343,
        car_brand: 'Toyota',
        rate: 4.4
    }

    Coach.create(coach)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            console.log('Error: create new coach:', error)
            res.status(500).json({
                error: error
            })
        })
})
module.exports = router