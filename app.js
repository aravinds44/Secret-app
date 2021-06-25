require('dotenv').config()

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/register",function(req,res){

    const newUser  = new User({
        email :req.body.username,
        password : req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });

});

app.post("/login",function(req,res){
    const loginUsername = req.body.username;
    const loginPassword = req.body.password;

    User.findOne({email : loginUsername},function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === loginPassword){
                    res.render("secrets");
                }
            }
        }
    });

});


app.listen(3000,function(){
    console.log("Server running on port 3000");
});