const express = require('express')
const connectDB = require('./config/db')

const app = express()

//Call database

connectDB()

//Init Middleware

app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API running'))

// Define routes

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 5000 // run on port 5000

app.listen(PORT, ( req, res ) => console.log(`Server is running at port ${ PORT }`))