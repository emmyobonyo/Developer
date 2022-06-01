const express = require('express')

const app = express()

app.get('/', function(req, res){
  res.send('Application is running')
})

// app.get('./', (req, res) => res.send('API running'))

const PORT = process.env.PORT || 5000

app.listen(PORT, ( req, res ) => console.log(`Server is running at port ${ PORT }`))