const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    verification: {
        type: Boolean,
        default: false,
    },
    tokenizer: {
        type: String,
        default: null,
    },
    forgetpassword: {
        type: Boolean,
        default: false
    },
    // resetPasswordToken:{
    //     type:String
    // },
    // resetPasswordTokenExpire:{
    //     type:Date,
    // },
    profile: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    dob: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    admin:{
        type:Boolean,
        default:false
    }
})

/*userSchema.pre('save',async function(next){
      this.password=await bcrypt.hash(this.password,10);
})*/

userSchema.pre('save', async function (next) {
    // Only hash the password if it is being modified or is new
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isValidPassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}

function generateRandomString(length) {
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomCharCode = Math.floor(Math.random() * 36) + 48; // ASCII codes for 0-9 (48-57) and A-Z (65-90)
        randomString += String.fromCharCode(randomCharCode);
    }
    return randomString.toUpperCase();
}




const usermodel = mongoose.model("user", userSchema, "UserCredential");
module.exports = usermodel;