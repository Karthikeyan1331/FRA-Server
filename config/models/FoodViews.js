const mongoose = require('mongoose');

const foodViews = new mongoose.Schema({
    food_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodRecipe', // Reference to the Food collection
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

const FoodViews = mongoose.model('FoodViews', foodViews,'FoodViews');

module.exports = FoodViews;
