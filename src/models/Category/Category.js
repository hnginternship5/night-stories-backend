const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true
  },
  category_description: {
    type: String,
    required: true
  },

  category_image: String,

  category_premium: Boolean,

  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
