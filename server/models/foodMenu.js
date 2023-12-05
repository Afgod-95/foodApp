const mongoose = require('mongoose');

const FoodMenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FoodMenu = mongoose.model('food-menu', FoodMenuSchema);

module.exports = FoodMenu;
