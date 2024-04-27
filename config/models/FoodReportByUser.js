const mongoose = require('mongoose');

// Define the schema
const foodReportSchema = new mongoose.Schema({
  Food_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodRecipe',
    required: true,
  },
  Food_name: {
    type: String,
    required: true,
  },
  User_email_id: {
    type: String,
    required: true,
  },
  TypeReport: {
    type: String,
    required: true,
  },
  Problem: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
const FoodReportByUser = mongoose.model('FoodReportByUser', foodReportSchema, 'FoodReportByUser');
module.exports = FoodReportByUser;
