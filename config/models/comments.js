const mongoose = require('mongoose');

// Define the schema for FoodComments
const foodCommentSchema = new mongoose.Schema({
    Food_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodRecipe', 
        required: true
    },
    Food_Comment: {
        type: String,
        required: true
    },
    User_email_id: {
        type: String,
        required: true
    },
    likes: {
        type: [String], // Array of user email IDs who liked the comment
        default: [] // Default value is an empty array
    },
    dislikes: {
        type: [String], // Array of user email IDs who disliked the comment
        default: [] // Default value is an empty array
    },
    created_date: {
        type: Date,
        default: Date.now // Default value is the current date and time
    }
});

// Create the FoodComment model based on the schema
const FoodComment = mongoose.model('FoodComment', foodCommentSchema, 'FoodComment');

// Export the model to be used in other parts of the application
module.exports = FoodComment;