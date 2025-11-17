require('dotenv').config()
const express = require('express')
const mongodbConnect = require('./database')
const Product = require('./model/productModel')
const upload = require('./middleware/multerConfig')
console.log(process.env)

mongodbConnect()
const app = express() 
app.use(express.json())

// all data get 
app.get('/product', async (req, res) => { 
  const product = await Product.find() 
  res.json({
    message: "Product fetched successfully.",
    data:product
  })
})

//get single product 
app.get('/product/:id', async (req,res)=> {
  const {id} = req.params
  const singleData = await Product.findById(id)
  res.json({
    message: "Product fetched successfully.",
    data:singleData
  })
})

//delete single product 
app.delete('/product/:id', async (req,res)=> {
  const {id} = req.params
  const product = await Product.findByIdAndDelete(id)
  res.json({
    message: "Product deleted successfully.",
    data:product
  })
})


// product create 
app.post('/product', upload.single("image") ,async (req, res) => { 
   
  const {name, description, price} = req.body

  const filename = req.file.filename

  const product = await Product.create({name, description, price, image: filename})

  res.json({
    message: "Product created successfully.",
    data:product
  })

})



app.listen(process.env.BASE_URL, () => {
  console.log(`Server started on port: ${process.env.BASE_URL}`)
})

