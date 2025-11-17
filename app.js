require('dotenv').config()
const express = require('express')
const mongodbConnect = require('./database')
console.log(process.env)

mongodbConnect()
const app = express() 

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/product', (req, res) => {
  res.send('Product page!')
})

app.post('/product', (req, res) => {  
  res.send('Product page!')
})



app.listen(process.env.BASE_URL, () => {
  console.log(`Example app listening on port ${process.env.BASE_URL}`)
})

