
const FoodRecipe = require('./models/FoodRecipe')
const FoodBookmark = require('./models/FoodBookmark')
const FoodLikes = require('./models/FoodLikes')
const FoodViews = require("./models/FoodViews")
class History {
    sortedbyDate(food){
        return food.sort((a, b) => {
            // Convert the created_date strings to Date objects
            const dateA = new Date(a.created_date);
            const dateB = new Date(b.created_date);
            
            // Sort in descending order based on the date
            return dateB - dateA;
        });
    }
    async getAllRecipe(data) {
        let arr = []
        for (let i of data) {
            console.log("2")
            let food = await FoodRecipe.findById({ _id: i["food_id"] })
            arr.push(food)
        }
        return arr
    }
    async bookmarks(req) {
        try {
            console.log("SpiderMan")
            if (req.user_data) {
                let email_id = req.user_data.email
                let food = await FoodBookmark.find({ email_id })
                food = this.sortedbyDate(food)
                let arr = await this.getAllRecipe(food)
                if (arr.length > 0) {
                    return [true, arr]
                }
                
                return [false, arr]
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    async likes(req) {
        try {
            if (req.user_data) {
                let email_id = req.user_data.email
                let food = await FoodLikes.find({ email_id })
                food = this.sortedbyDate(food)
                let arr = await this.getAllRecipe(food)
                if (arr.length > 0) {
                    return [true, arr]
                }
                return [false, arr]
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    async views(req) {
        try {
            if (req.user_data) {
                let email_id = req.user_data.email
                let food = await FoodViews.find({ email_id })
                food = this.sortedbyDate(food)
                let arr = await this.getAllRecipe(food)
                if (arr.length > 0) {
                    return [true, arr]
                }
                return [false, arr]
            }
        }
        catch (error) {
            console.log(error)
        }
    }
}
let obj = new History()
module.exports = obj