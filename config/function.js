
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const client = new MongoClient("mongodb://127.0.0.1:27017");
const userModel = require('./models/userModel')
const mongoose = require('mongoose');
class CommanFunction {
    async main(dbname, collectionname) {
        await client.connect();
        const db = client.db(dbname);
        const collection = db.collection(collectionname);
        return collection;
    }
    setSessionLogin(req, data) {
        req.session.email = data.email
        req.session.data = data
        console.log(req.session)
    }
    async foodInstructionData(id) {
        const collection = await this.main('FoodRecipeDB', 'FoodRecipe');
        // Convert the string id to ObjectId using mongoose.Types.ObjectId
        const objectId = new mongoose.Types.ObjectId(id);
        // Find the document based on the converted ObjectId
        const item = await collection.findOne({ _id: objectId });
        let arr = [item['TranslatedRecipeName'],
        item['Cuisine'],
        item['Diet'],
        item['Course'],
        item['Image'],
        item['TranslatedIngredients'],
        item['TotalTimeInMins'],
        item['Servings'],
        item['TranslatedInstructions'],
        item['_id']]
        return arr;
    }
    //Likes
    async userLikedNot(id, onclick, req) {
        const collection = await this.main('FoodRecipeDB', 'FoodLikes');
        const objectId = new mongoose.Types.ObjectId(id);
        let existed = false;
    
        if (req.session.email) {
            const user = await collection.findOne({ food_id: objectId, email_id: req.session.email });
    
            if (!onclick) {
                existed = !!user; // Convert user to a boolean value
                return existed; // Return the existing like status
            } else {
                if (user) {
                    // User already liked the item, so unlike it
                    existed = false;
                    await collection.deleteOne({ food_id: objectId, email_id: req.session.email });
                    console.log(existed,onclick,"remove")
                    return existed;
                } else {
                    // User didn't like the item, so like it
                    await collection.insertOne({
                        food_id: objectId,
                        email_id: req.session.email,
                        created_date: new Date()
                    });
                    existed = true; // User now likes the item
                    console.log(existed,onclick,"add")
                    return existed;
                }
            }
        }
         // Return the updated like status
    }
    async getFoodLikes(id, req) {
        const collection = await this.main('FoodRecipeDB', 'FoodLikes');
        // Convert the string id to ObjectId using mongoose.Types.ObjectId
        const objectId = new mongoose.Types.ObjectId(id);
        // Find the document based on the converted ObjectId
        const count = await collection.countDocuments({ food_id: objectId });
        const existed = await this.userLikedNot(id, false, req) 
        return [count, existed]
    }
    async checkUserIdPassword(email, password) {
        const collection = await this.main('FoodRecipeDB', 'UserCredential');
        const user = await collection.findOne({ email: email });
        if (user) {
            if (user.verification) {
                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                if (isPasswordCorrect) {
                    this.setSessionLogin(req, { firstName: user.firstName, lastName: user.lastName, email: user.email, picture: null, verification: user.verification })
                    return { status: true }
                }
                else {
                    return { status: false, message: "Password is Incorrect" }
                }
            }
            else {
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
    async register_user(userCredential, req, res) {
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
}




let obj = new CommanFunction()
module.exports = obj