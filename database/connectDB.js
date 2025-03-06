const mongoose = require('mongoose')
require('dotenv').config

const connectString = process.env.connectString

async function connectDb(){
    await mongoose.connect(connectString)
    console.log("database connected successfully");
    
}

module.exports = connectDb


