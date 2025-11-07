require('dotenv').config()
const express = require('express')
console.log(process.env)

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/product', (req, res) => {
  res.send('Product page!')
})



app.listen(process.env.BASE_URL, () => {
  console.log(`Example app listening on port ${process.env.BASE_URL}`)
})


// app.get("", (req,res) => {
//     res.json({})
// })
