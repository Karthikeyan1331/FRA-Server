const mongoose = require('mongoose');

const foodLikesSchema = new mongoose.Schema({
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

const FoodLikes = mongoose.model('FoodLikes', foodLikesSchema,'FoodLikes');

module.exports = FoodLikes;
