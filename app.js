const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

const uri = 'mongodb+srv://new_user:user1234@nodetuts.lx1xc.mongodb.net/coachticketdb?retryWrites=true&w=majority'
const servicePort = 3000

const companyRouter = require('./routes/companyRoutes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Databse is connected')
        app.listen(servicePort)
    })
    .catch((error) => {
        console.log('Error connect database: ', error)
    })

app.use('/companys', companyRouter)



