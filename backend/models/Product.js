const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    offer: { type: Number, default: 0 }
});

module.exports = mongoose.model("Product", ProductSchema);
