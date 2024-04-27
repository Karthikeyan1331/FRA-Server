const FoodReportByUser = require("./models/FoodReportByUser")
const FoodRecipe = require("./models/FoodRecipe")
const userModel = require("./models/userModel")
class AdminWorks {
    async userEmail(data) {
        let i = 0
        let data1 = []
        for (let key of data) {
            let _id = key['created_by']
            let user = await userModel.findById({ _id })

            if (user)
                data1.push({ ...data[i]._doc, email: user.email })
            console.log(data1)
            i++
        }
        return data1
    }
    async fetchReport(req) {
        try {
            const allReports = await FoodReportByUser.find();
            if (allReports)
                return [true, allReports];
            return [false, []]
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw new Error('Error fetching reports');
        }
    }
    async fetchFoodInWaiting(req) {
        try {
            const allReports = await this.userEmail(await FoodRecipe.find({ approve: 0 }))
            if (allReports)
                return [true, allReports]
            return [false, []]
        }
        catch (error) {
            console.log(error)
        }
    }
    async ApproveFood(req) {
        try {
            const { _id } = req.body;
            const updatedRecipe = await FoodRecipe.findByIdAndUpdate(
                _id,
                { approve: 1 },
                { new: true }
            );
            if (!updatedRecipe) {
                throw new Error("Recipe not found");
            }
            return [true, updatedRecipe];
        } catch (error) {
            console.error("Error approving food recipe:", error);
            throw error; // Throw the error for handling in the caller function
        }
    }
    async RejectFood(req) {
        try {
            const { _id } = req.body;
            const updatedRecipe = await FoodRecipe.findByIdAndUpdate(
                _id,
                { approve: 2 },
                { new: true }
            );
            if (!updatedRecipe) {
                throw new Error("Recipe not found");
            }
            return [true, updatedRecipe];
        } catch (error) {
            console.error("Error approving food recipe:", error);
            throw error; // Throw the error for handling in the caller function
        }
    }
}

let obj = new AdminWorks()
module.exports = obj