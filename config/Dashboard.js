
const FoodRecipe = require('./models/FoodRecipe')
const FoodBookmark = require('./models/FoodBookmark')
const FoodLikes = require('./models/FoodLikes')
const FoodReportByUser = require('./models/FoodReportByUser')
const FoodViews = require("./models/FoodViews")
const FoodDB = require("./models/FoodRecipe")
const mongoose = require('mongoose');

class Dashboard {
    async collectMyFood(req) {
        try {
            let created_by = req.user_data._id;
            const fooddata = await FoodDB.find({ created_by });
            if (fooddata && fooddata.length > 0) {
                return [true, fooddata];
            } else {
                return [false, []];
            }
        } catch (error) {
            console.error("Error in collectMyFood:", error);
            return [false, []];
        }
    }

    async createFood(data) {
        try {
            let { TranslatedRecipeName, TranslatedIngredients, PrepTimeInMins, CookTimeInMins,
                Servings, Cuisine, Course, Diet, TranslatedInstructions, Image, _id } = data;
            console.log(TranslatedRecipeName, TranslatedIngredients, PrepTimeInMins, CookTimeInMins,
                Servings, Cuisine, Course, Diet, TranslatedInstructions, Image, _id)
            let URL = Image, TotalTimeInMins = Number(PrepTimeInMins) + Number(CookTimeInMins)
            console.log(URL, TotalTimeInMins)
            let created_by = new mongoose.Types.ObjectId(_id)
            console.log(created_by)
            let newFoodRecipe = new FoodRecipe({
                TranslatedRecipeName,
                TranslatedIngredients,
                PrepTimeInMins,
                CookTimeInMins,
                TotalTimeInMins,
                Servings,
                Cuisine,
                Course,
                Diet,
                TranslatedInstructions,
                URL,
                Image,
                created_by
            });
            let temp = await newFoodRecipe.save()
            if (temp)
                return [true, temp]
            return [false, []]
        } catch (error) {
            return [false, error.message];
        }
    }

    async editFood(data) {
        try {
            let { TranslatedRecipeName = null,
                TranslatedIngredients = null,
                PrepTimeInMins = null,
                CookTimeInMins = null,
                TotalTimeInMins = null,
                Servings = null,
                Cuisine = null,
                Course = null,
                Diet = null,
                TranslatedInstructions = null,
                URL = null,
                Image = null,
                food_id = null,
                approve = null } = data
            URL = Image
            approve = 0
            TotalTimeInMins = Number(PrepTimeInMins) + Number(CookTimeInMins)
            const query = Object.fromEntries(
                Object.entries({
                    TranslatedRecipeName,
                    TranslatedIngredients,
                    PrepTimeInMins,
                    CookTimeInMins,
                    TotalTimeInMins,
                    Servings,
                    Cuisine,
                    Course,
                    Diet,
                    TranslatedInstructions,
                    URL,
                    Image,
                    approve
                }).filter(([_, value]) => value !== null && value !== ""));
            if (!food_id) {
                return [false, "Not get the Food Id Value"]
            }
            let _id = new mongoose.Types.ObjectId(food_id)
            let updatedRecipe = await FoodRecipe.findOneAndUpdate(
                { _id: _id }, // Filter by _id
                { $set: query }, // Set the updated data
                { new: true } // Return the updated document
            );
            if (updatedRecipe) {
                return [true, updatedRecipe];
            } else {
                return [false, []];
            }
        } catch (error) {
            return [false, error.message];
        }
    }
    async deleteFood(req) {
        try {
            let _id = req.body._id;
            // Check if _id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                throw new Error('Invalid ObjectId');
            }

            // Delete the food record
            let deletedFood = await FoodRecipe.deleteOne({ _id: _id });
            await FoodViews.deleteMany({ food_id: _id })
            await FoodLikes.deleteMany({ food_id: _id })
            await FoodBookmark.deleteMany({ food_id: _id })
            await FoodReportByUser.deleteMany({ Food_id: _id })

            if (deletedFood.deletedCount > 0) {
                return [true, deletedFood];
            } else {
                return [false, 'Food not found or already deleted'];
            }
        } catch (error) {
            return [false, error.message];
        }
    }

}
const obj = new Dashboard()
module.exports = obj