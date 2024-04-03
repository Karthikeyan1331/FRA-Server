const { MongoClient } = require('mongodb');
const bcrypt=require('bcrypt');
const client = new MongoClient("mongodb://127.0.0.1:27017");
const userModel = require('./models/userModel')
const axios = require("axios");
const { response } = require('../app');

class SignInWithGoogle {
    async signWithgoogle(req,res){
        if(req.body.googleAccessToken){
            axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers:{
                    "Authorization":`Bearer ${req.body.googleAccessToken}`
                }
            }).then(async response=>{
                const firstName = response.data.given_name;
                const lastName = response.data.family_name;
                const email = response.data.email;
                const picture = response.data.picture
            })
        }
    }
}
let obj = new SignInWithGoogle()
module.exports = obj