const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const servicePort = 5000

const routeRouter = require('./routes/route_routes')
const coachRouter = require('./routes/coachRoutes')
const userRouter = require('./routes/user_routes')
const locationRouter = require('./routes/location_routes')
const ticketRouter = require('./routes/tickets_routes')

const { static } = require('express')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use("./public", static("public"))

app.listen(servicePort)

app.use('/tickets', ticketRouter)
app.use('/locations', locationRouter)
app.use('/routes', routeRouter)
app.use('/users', userRouter)
app.use('/coach', coachRouter)



