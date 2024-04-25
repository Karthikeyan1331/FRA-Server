const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const client = new MongoClient("mongodb://127.0.0.1:27017");
const axios = require("axios");
const userModel = require('./models/userModel')
const dataFunction = require('./function')
const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: 'strict', // Restricts the cookie to same-site requests
    secure: true, // Ensures the cookie is sent only over HTTPS
};
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
                const t = await existingUser.save();
                const token = dataFunction.createJWTtoken(req, t)
                const dataD = { ...t._doc, tokenD: token }
                dataFunction.setSessionLogin(req, dataD)
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
            const t = await user.save();
            console.log(t)
            console.log(tokenizer);
            const token = dataFunction.createJWTtoken(req, t)
            const dataD = { ...t._doc, tokenD: token }
            dataFunction.setSessionLogin(req, dataD)
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