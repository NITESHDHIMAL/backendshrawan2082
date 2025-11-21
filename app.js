require('dotenv').config()
const express = require('express')
const mongodbConnect = require('./database')
const Product = require('./model/productModel')
const upload = require('./middleware/multerConfig')
const User = require('./model/userModel') 
const jwt = require('jsonwebtoken')

mongodbConnect()
const app = express()
app.use(express.json())

// all data get 
app.get('/product', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;
  const product = await Product.find().skip(skip).limit(limit);

  const total = await Product.countDocuments();
  res.json({
    message: "Product fetched successfully.",
    data: product,
    totalItems: total,
    currentPage: page,
  })
})

// product search 
app.get("/product/search", async (req, res) => {
  const { q } = req.query;
  const serchProduct = await Product.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ]
  })
  res.json({
    message: "Product fetched succesfully.",
    data: serchProduct
  })
})

//get single product 
app.get('/product/:id', async (req, res) => {
  const { id } = req.params
  const singleData = await Product.findById(id)
  res.json({
    message: "Product fetched successfully.",
    data: singleData
  })
})

//delete single product 
app.delete('/product/:id', async (req, res) => {
  const { id } = req.params
  const product = await Product.findByIdAndDelete(id)
  res.json({
    message: "Product deleted successfully.",
    data: product
  })
})


// product create 
app.post('/product', upload.single("image"), async (req, res) => {

  const { name, description, price } = req.body

  const filename = req.file.filename

  const product = await Product.create({ name, description, price, image: filename })

  res.json({
    message: "Product created successfully.",
    data: product
  })
})


// product edit  
app.patch("/product/:id", upload.single("image"), async (req, res) => {

  const { id } = req.params;

  const { name, price, description } = req.body;

  const filename = req.file.filename

  await Product.findByIdAndUpdate(id, { name, price, description, image: filename })

  res.json({
    message: "Product updated successfully."
  })
})


// Register a new user 

app.post("/register", async (req, res) => {

  const { name, email, password } = req.body

  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        message: "User already exists."
      })
    }

    user = new User({
      name,
      email,
      password,
    })

    await user.save()

    res.status(201).json({
      message: "User registered successfully.",
      data: user
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
})

// login a user and generate a JWT 

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user email." })
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid user password"
      })
    }

    // generate a jwt 
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" })

    res.json({
      message: "Login Successfully.",
      token: token
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
})



app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`)
})

