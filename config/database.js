// database.js

const { MongoClient } = require('mongodb');
const ServerCall=require('./ServerCall')
const mongoose = require('mongoose')
let collection;  // Declare collection outside the function scope

const connectDatabase = async () => {
        const uri = process.env.DB_LOCAL_URI;

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            await client.connect();
            await mongoose.connect(uri).then((con)=>{
                console.log(`Connection in mongooser ${uri}`)
            }).catch((e)=>{
                console.log(e)
            })
            console.log(`Connected to MongoDB at ${uri}`);

            // Fetch data from the "FoodRecipe" collection
            collection = client.db('FoodRecipeDB').collection('FoodRecipe');  // Assign collection here
        UserCollection = client.db('FoodRecipeDB').collection('UserCredential');
        await 
        await printFoodRecipeData(collection);  // Pass collection to the function

        // Return the client instance
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};

// Function to print data from the "FoodRecipe" collection
const printFoodRecipeData = async (collection) => {
    try {
        // Fetch data from the "FoodRecipe" collection
        const foodRecipeData = await collection.find().toArray();

        // Print the data in the console
        console.log('FoodRecipe Collection Data:');
        if (foodRecipeData[0] && foodRecipeData[0]['Image']) {
            console.log(foodRecipeData[0]['Image']);
        } else {
            console.log("not found");
        }
        await ServerCall(collection, foodRecipeData);  // Pass collection to the ServerCall function
    } catch (error) {
        console.error('Error fetching and printing data:', error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};


// Function to build $or conditions for regex queries


module.exports = connectDatabase;
