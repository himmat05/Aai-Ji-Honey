const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  address: String,
  quantity: Number,
  product: {
    name: String,
    price: Number,
    totalprice: Number,
    image: String
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  paymentId: String,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
