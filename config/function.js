
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const client = new MongoClient("mongodb://127.0.0.1:27017");
const userModel = require('./models/userModel')
class CommanFunction {
    async main(dbname, collectionname) {
        await client.connect();
        const db = client.db(dbname);
        const collection = db.collection(collectionname);
        return collection;
    }
    setSessionLogin(req, data){
        req.session.email = data.email
        req.session.data = data
        console.log(req.session)
    }
    async checkUserIdPassword(email, password) {
        const collection = await this.main('FoodRecipeDB', 'UserCredential');
        const user = await collection.findOne({ email: email });
        if (user) {
            if (user.verification) {
                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                if (isPasswordCorrect) {
                    this.setSessionLogin(req, {firstName:user.firstName,lastName:user.lastName,email:user.email,picture:null,verification:user.verification})
                    return { status: true }
                }
                else {
                    return { status: false, message: "Password is Incorrect" }
                }
            }
            else{
                return { status: false, message: "Please verified your EmailId" }
            }
        } 
        else {
            return { status: false, message: "This emailId cannot existed" }
        }
    }
    async checkEmailVerified(email) {
        try {
            const collection = await this.main('FoodRecipeDB', 'UserCredential');
            const user = await collection.findOne({ email: email });
            return user.verification
        }
        catch (error) {
            console.log(error)
        }
    }
    async verifyUser(token) {
        try {
            const collection = await this.main('FoodRecipeDB', 'UserCredential');
            const user = await collection.findOne({ tokenizer: token });
            if (!user) {
                return { success: false, message: 'Token not found' };
            }
            await collection.updateOne(
                { tokenizer: token },
                { $set: { verification: true } }
            );
            return { success: true, message: "Account is verified" };
        } catch (error) {
            console.error('Error verifying user:', error);
            return { success: false, message: error };
        }

    }
}


async function register_user(userCredential, req, res) {
    console.log("you are here1")
    try {
        const { firstName, lastName, email, password } = userCredential
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(201).json({
                success: false,
                message: "EmailExisted"
            });
        }


        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password,
        })
        const tokenizer = user.getJwtToken();
        user.tokenizer = tokenizer;
        console.log(tokenizer)
        await user.save();
        await sendEmail(user);
        // await userModel.findOneAndDelete({ email: userCredential.email });
        //Code the email sender here
        res.status(201).cookie('Token', tokenizer, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
        }).json(
            { user, success: true }
        )
        // Remove the response sending from here

    }
    catch (error) {
        await userModel.findOneAndDelete({ email: userCredential.email });
        res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR"
        });
    }
}

let obj = new CommanFunction()
module.exports = obj