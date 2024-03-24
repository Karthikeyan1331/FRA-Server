const path=require('path');
const dotenv=require('dotenv');
dotenv.config({path:path.join(__dirname,"config/config.env")})

const cors = require('cors');
const express=require('express')
const app=express()
const body=require('body-parser');
const cookieParser = require('cookie-parser')
app.use(cookieParser());
app.use(express.json());
app.use(body.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace this with the origin of your frontend application
  credentials: true // Allow credentials (cookies)
}));
module.exports=app;