const userModel = require('../models/userModel')
const dataFunction = require("../function")
class EditUserData {
    async editFunction(req) {
        const { firstName, lastName, gender, state, country, dob } = req.body
        const { _id } = req.user_data
        const user = await userModel.findById({ _id })
        user.firstName = firstName
        user.lastName = lastName
        user.gender = gender
        user.state = state
        user.country = country
        user.dob = dob
        const t = await user.save()
        const token = dataFunction.createJWTtoken(req, t)
        const dataD = { ...t._doc, tokenD: token }
        dataFunction.setSessionLogin(req, dataD)
        if (t) {
            return [true, t]
        }
        else {
            return [false, []]
        }
    }
}
let obj = new EditUserData()
module.exports = obj