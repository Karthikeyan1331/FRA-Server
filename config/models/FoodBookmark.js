const mongoose = require('mongoose');

const foodBookmarkSchema = new mongoose.Schema({
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

const FoodBookmark = mongoose.model('FoodBookmark', foodBookmarkSchema, 'FoodBookmark');

module.exports = FoodBookmark;
