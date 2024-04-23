const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const client = new MongoClient("mongodb://127.0.0.1:27017");
const axios = require("axios");
const userModel = require('./models/userModel')
const dataFunction = require('./function')
class SignInWithGoogle {
    async signWithGoogle(req, res) {
        const details = req.user._json;
        const firstName = details.given_name;
        const lastName = details.family_name;
        const email = details.email;
        const password = details.sub;
        const verification = details.email_verified;
        const picture = details.picture;

        try {
            const existingUser = await userModel.findOne({ email });

            if (existingUser) {
                existingUser.verification = verification
                const t=await existingUser.save();
                dataFunction.setSessionLogin(req, t)
                res.redirect("http://localhost:3000");
                return
            }

            // Create a new user if not already existing
            const user = await userModel.create({
                firstName,
                lastName,
                email,
                password,
                verification,
            });

            const tokenizer = user.getJwtToken();
            user.tokenizer = tokenizer;
            const t= await user.save();
            console.log(t)
            console.log(tokenizer);
            dataFunction.setSessionLogin(req, t)
            res.redirect("http://localhost:3000");
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "INTERNAL SERVER ERROR"
            });
        }
    }
}
let obj = new SignInWithGoogle()
module.exports = obj