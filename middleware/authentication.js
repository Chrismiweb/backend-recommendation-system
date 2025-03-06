// imported jwt
const jwt = require ('jsonwebtoken');
require('dotenv').config();
// imported the usermodel from the model folder and user file
const userModel = require('../model/User');
const isLoggedIn = async (req, res, next) => {
    // to verify token using jwt
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.jwt_secret);
            req.user = await userModel.findById(decoded.userId);
            if(!req.user){
                return res.status(401).json({error: "not authorized, pls login"});
            }

        } catch (error) {
            console.log(error.message);
            return res.status(403).json({error:"Invalid token"});
            
        }
        
    }

    if(!token) {
        return res.status(401).json({error: "token is missing from the header"});
    }

    next()
}

const isAdmin = (req, res, next)=>{
    if(!req.user){
        return res.status(401).json({error: "not authorized, pls login as admin"}); 
    }

    if(req.user.role !== "admin" ){
        return res.status(401).json({error: "not authorized, you're not an admin"}); 
    }
    next()
}

module.exports = {isLoggedIn, isAdmin}