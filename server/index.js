const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotEnv = require('dotenv').config()
const morgan = require('morgan')

const app = express()
const PORT = 8000

const router = require('./route/router.js')

//middlewares 
app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('tiny'))

//routes
app.use(router)

//database connection
mongoose.connect(process.env.MONGODB_URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
    console.log('Connected to MongoDB')
}).catch (err => {
    console.log(`Error: ${err}`)
}) 

