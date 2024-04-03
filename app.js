const path=require('path');
const dotenv=require('dotenv');
dotenv.config({path:path.join(__dirname,"config/config.env")})

const cors = require('cors');
const express=require('express')
const app=express()
const body=require('body-parser');
const cookieParser = require('cookie-parser')
const session =require('express-session')
const passport = require("passport")
const passportSetup = require("./config/passport")
app.use(cors({
  origin: ['http://localhost:3000'],
  methods:['POST','GET'], // Replace this with the origin of your frontend application
  credentials: true // Allow credentials (cookies)
}));

app.use(cookieParser());
app.use(express.json());
app.use(body.json());
app.use(session({
  secret: 'kathiresan',
  saveUninitialized:false,
  resave: true,
  rolling:true,
  cookie:{
    secure:false,
    maxAge:1000*60*60*24
  }
}))
app.use(passport.initialize())
app.use(passport.session())
module.exports=app;