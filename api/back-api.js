const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')

const app = express()
const ClientModel = require('./../clients/ClientModel')(mongoose)
const Client = require('./../clients/Client')(ClientModel)
const clientRoutes = require('./../clients/client.routes')(express, Client)

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(require('./middlewares/allowCrossDomain'))

app.use('/api/clients', clientRoutes)

app.use(require('./middlewares/errorHandler'))

app.listen(config.port)
console.info(`backend-api API running in ${config.port}`)