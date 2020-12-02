const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const servicePort = 3000

const routeRouter = require('./routes/route_routes')
const userRouter = require('./routes/user_routes')
const locationRouter = require('./routes/location_routes')
const ticketRouter = require('./routes/tickets_routes')

const { static } = require('express')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use("./public", static("public"))

app.listen(servicePort)

app.use('/tickets', ticketRouter)
app.use('/locations', locationRouter)
app.use('/routes', routeRouter)
app.use('/users', userRouter)



