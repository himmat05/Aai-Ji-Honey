// server.js
const Razorpay = require('razorpay');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Owner = require('./models/owner');
const Order = require('./models/order');
const Product = require('./models/Product');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();
const PORT = 5000;
const JWT_SECRET = 'KOe5FSJKJcq7NX3ejOOOiJisiAD98iTO'; // Use a secure secret in production


app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// payment method routes

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get('/', (req, res) => {
  res.send('API is working!');
});


app.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const payment = await razorpay.orders.create({
      amount: amount, // amount is already in paise from frontend
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(2)
    });
    res.json({ order: payment });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});


// razorpay payment 
app.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // ✅ Payment verified
    res.json({ success: true });
  } else {
    // ❌ Payment tampered or fake
    res.status(400).json({ success: false, message: "Signature verification failed" });
  }
});




// register owner route
app.post("/register-owner", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new Owner({ email, password: hashedPassword });
    await owner.save();
    res.status(201).send("Owner registered successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering owner.");
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// login route 

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  // ✅ Get user's IP address
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.socket?.remoteAddress;

  try {
    const owner = await Owner.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") }
    });

    if (!owner) {
      console.log(`❌ Owner not found for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // ✅ Send login email with IP and location
    await sendLoginEmail(owner.email, ip);

    res.json({ token });
  } catch (err) {
    console.error("Server error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 💌 Email sender function
async function sendLoginEmail(toEmail, ip) {
  try {
    // 🌍 Get geolocation from IP
    let locationInfo = "Unknown location";
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      const data = response.data;
      if (data.status === "success") {
        locationInfo = `${data.city}, ${data.regionName}, ${data.country}`;
      }
    } catch (locationError) {
      console.error("🌐 IP location lookup failed:", locationError.message);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "🔐 Login Alert - Owner Dashboard Access",
      text: `Hello,

         Your owner dashboard was just accessed on ${new Date().toLocaleString()}.

         Login Location: ${locationInfo}
         IP Address: ${ip}

         If this wasn't you, please secure your account immediately.

        - Aai Ji Honey Team`,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`📧 Login alert sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Failed to send login email:", error);
  }
}


app.post('/orders', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    const next = count + 1;

    const year = new Date().getFullYear() + 1;
    const invoiceNumber = `AJh/${year},${String(next).padStart(4, '0')}`;

    const order = new Order({
      ...req.body,
      invoiceNumber
    });

    await order.save();
    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: 'Error placing order' });
  }
});



// ✅ Get all orders for owner dashboard
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
});

// ✅ Mark order as completed
app.patch('/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err });
  }
});



// Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Add Product
// app.post('/products', authenticateToken, upload.single('image'), async (req, res) => {
//   try {
//     const { name, price } = req.body;
//     let imageBase64 = '';
//     let mimeType = '';

//     if (req.file) {
//       const mimeType = req.file.mimetype || "image/jpeg"; // fallback if missing
//       const imageBase64 = fs.readFileSync(req.file.path, { encoding: 'base64' });
//       fs.unlinkSync(req.file.path); // delete temp file
//       imageData = `data:${mimeType};base64,${imageBase64}`;
//     }


//     const newProduct = new Product({
//       name,
//       price,
//       image: `data:${mimeType};base64,${imageBase64}` // store full data URL
//     });
//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.post('/products', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;

    // default when no image uploaded
    let imageData = "";

    // only process if multer saved a file (req.file exists)
    if (req.file) {
      const mimeType = req.file.mimetype || "image/jpeg";
      const base64 = fs.readFileSync(req.file.path, { encoding: "base64" });
      // cleanup temp file
      fs.unlinkSync(req.file.path);
      imageData = `data:${mimeType};base64,${base64}`;
    }

    const newProduct = new Product({
      name,
      price,
      image: imageData // store full data URL or "" if no image
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error in POST /products:", err);
    res.status(500).json({ error: err.message });
  }
});


// // Update Product
// app.put('/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ error: 'Invalid product ID' });
//     }

//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).send('Product not found');

//     const { name, price } = req.body;
//     if (name) product.name = name;
//     if (price) product.price = parseFloat(price);

//     if (req.file) {
//       const mimeType = req.file.mimetype;
//       const imageBase64 = fs.readFileSync(req.file.path, { encoding: 'base64' });
//       fs.unlinkSync(req.file.path);
//       product.image = `data:${mimeType};base64,${imageBase64}`;
//     }

//     await product.save();
//     res.json(product);
//   } catch (err) {
//     console.error("Error updating product:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.put('/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { name, price } = req.body;
    if (name) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);

    if (req.file) {
      const mimeType = req.file.mimetype || "image/jpeg";
      const base64 = fs.readFileSync(req.file.path, { encoding: "base64" });
      fs.unlinkSync(req.file.path);
      product.image = `data:${mimeType};base64,${base64}`;
    }
    // if no req.file, leave product.image unchanged

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: err.message });
  }
});




// Delete product (protected)
app.delete('/products/:id', authenticateToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
