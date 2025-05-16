const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  stockName: {
    type: String,
    required: true,
  },
  stockCode: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stockDescription: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("stock", stockSchema);
