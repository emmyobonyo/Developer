const express = require('express')
const connectDB = require('./config/db')

const app = express()

//Call database

connectDB()

app.get('/', (req, res) => res.send('API running'))

const PORT = process.env.PORT || 5000 // run on port 5000

app.listen(PORT, ( req, res ) => console.log(`Server is running at port ${ PORT }`))