const express = require('express')

const app = express()

// app.get('./', (req, res) => res.send('API running')) <-- Not woring for some reason

app.get('/', function(req, res){
  res.send('Application is running')
})

const PORT = process.env.PORT || 5000 // run on port 5000

app.listen(PORT, ( req, res ) => console.log(`Server is running at port ${ PORT }`))