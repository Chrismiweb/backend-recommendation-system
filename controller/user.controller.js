const userModel = require("../model/userModel");
const jwt = require('jsonwebtoken');
require('dotenv').config()
// const bcrypt = require('bcrypt');


// this code registers users
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!firstName || !lastName || !userName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Please input all credentials to register" });
    }

    if(password !== confirmPassword){
        return res.status(400).json({error:"password and confirm password doesn't match"})
    }

    // check existing user
    const existingUser = await userModel.findOne({email})
    if(existingUser){
        return res.status(401).json({error: "user with this email already exist"})
    }
    // // Salt and hash password
    // const salt = bcrypt.genSaltSync(10); // Reduced salt rounds to 10 for better performance
    // const hashedPassword = bcrypt.hashSync(password, salt);
    

    // Register new user
    const newUser = new userModel({
      lastName,
      firstName,
      userName,
      email,
      password,
      confirmPassword
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully", newUser });

  } catch (error) {
    console.error("Error registering user:", error);

  
  }
};


// this code logins user 

const loginUser = async(req, res)=>{
    const{email, password} = req.body
    if(!email || !password){
        return res.status(400).json({error: "input all credentials to login"})
    }
    const existingUser = await userModel.findOne({email})
    if(!existingUser){
        return res.status(404).json({error: "user with this email doesn't exist"})
    }
    
   
    if(password !== existingUser.password){
      return res.status(401).json({error: "password is incorrect"})
    }
    const token = jwt.sign({ userId : existingUser._id}, process.env.jwt_secret,{ expiresIn: "1h"});

    res.status(200).json({
      message: " login successfully", 
      existingUser, 
      token
    })


    
}



module.exports = { registerUser, loginUser }; 
