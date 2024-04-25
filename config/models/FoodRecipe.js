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
        default:null
    },
    Image: {
        type: String,
        default: null
    },
    approve:{
        type: Number,
        default: 0
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCredential', // Reference to the Food collection
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now
    }
});

const FoodRecipe = mongoose.model('FoodRecipe', foodRecipeSchema, 'FoodRecipe');

module.exports = FoodRecipe;
