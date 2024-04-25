const mongoose = require('mongoose');

const foodRecipeSchema = new mongoose.Schema({
    TranslatedRecipeName: {
        type: String,
        required: true
    },
    TranslatedIngredients: {
        type: String,
        required: true
    },
    PrepTimeInMins: {
        type: Number,
        required: true
    },
    CookTimeInMins: {
        type: Number,
        required: true
    },
    TotalTimeInMins: {
        type: Number,
        required: true
    },
    Servings: {
        type: Number,
        required: true
    },
    Cuisine: {
        type: String,
        required: true
    },
    Course: {
        type: String,
        required: true
    },
    Diet: {
        type: String,
        required: true
    },
    TranslatedInstructions: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default:0,
    }
});

const FoodRecipe = mongoose.model('FoodRecipe', foodRecipeSchema, 'FoodRecipe');

module.exports = FoodRecipe;
