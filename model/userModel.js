const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const userSchema = new Schema({
    firstName :{type: String},
    lastName :{type: String},
    userName :{type: String},
    email :{type: String},
    password :{type: String},
    confirmPassword :{type: String}
   

});

const userModel = model("User", userSchema)

module.exports = userModel