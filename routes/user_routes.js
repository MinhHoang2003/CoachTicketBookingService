const express = require('express')
const User = require('../controler/user')
const router = express.Router()

const user = new User()

router.get('/', (req, res) => {
    let role = req.query["role"]
    console.log(role)
    user.findAll(role)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json(new Error(err))
        })
})

router.get('/detail', (req, res) => {
    let id = req.query["id"]
    console.log(id)
    user.findOne(id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json(new Error(err))
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
    user.login(username, password)
    .then(result => {
        console.log("complete : ", result)
        res.status(200).send(result)
    }).catch(err => {
        console.log(err)
        res.status(500).send(err.message)
    })
})


router.put('/update', (req, res) => {
    let body = req.body
    let userId = req.query["id"]
    user.update(body, userId)
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json(new Error(err))
        })
})

router.put('/updateWithPassword', (req, res) => {
    let body = req.body
    let userId = req.query["id"]
    let pass = req.query["password"]
    user.updateWithPassword(body, pass, userId)
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send(new Error(err.message))
        })
})

module.exports = router