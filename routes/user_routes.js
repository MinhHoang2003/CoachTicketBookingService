const express = require('express')
const User = require('../controler/user')
const router = express.Router()

const user = new User()

router.get('/', (req, res) => {
    res.status = 200
    res.json({
        message: 'get new users'
    })
})

router.get('/:phone_number', (req, res) => {
    let phoneNumber = req.params['phone_number']
    user.find(phoneNumber, (err, result) => {
        if (result) {
            res.status = 200
            res.json(result)
        } else {
            res.status = 500
            res.json({
                error: err
            })
        }
    })
})

router.post('/register', (req, res) => {
    const user_request = {
        phone_number: req.body.phone_number,
        name: req.body.name,
        avatar_url: req.body.avatar_url,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        role: req.body.role
    }

    console.log(user_request)
    user.create(user_request, (err, result) => {
        if (result) {
            res.status = 200
            res.json(result)
        } else {
            res.status = 500
            res.json({
                error: err
            })
        }
    })
})

router.post('/login', (req, res) => {
    let username = req.body.phone_number
    let password = req.body.password
    user.login(username, password, (result) => {
        if (result === null) {
            res.status = 500
            res.json({
                message: result
            })
        } else {
            res.status = 200
            res.json(result)
        }
    })
})

module.exports = router