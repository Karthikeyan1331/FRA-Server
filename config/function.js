
const { MongoClient } = require('mongodb');
const bcrypt=require('bcrypt');
const client = new MongoClient("mongodb://127.0.0.1:27017");
class CommanFunction {
    async main(dbname, collectionname) {
        await client.connect();
        const db = client.db(dbname);
        const collection = db.collection(collectionname);
        return collection;
    }
    async checkUserIdPassword(email,password){
        const collection = await this.main('FoodRecipeDB', 'UserCredential');
        const user = await collection.findOne({ email: email });
        if(user){
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if(isPasswordCorrect){
                return {status:true}
            }
            else{
                return {status:false,message:"Password is Incorrect"}
            }
        }
        else{
            return {status:false, message:"This emailId cannot existed"}
        }
    }
    async checkEmailVerified(email){
        try{
            const collection = await this.main('FoodRecipeDB', 'UserCredential');
            const user = await collection.findOne({ email:email });
            return user.verification
        }
        catch(error){
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

let obj = new CommanFunction()
module.exports = obj