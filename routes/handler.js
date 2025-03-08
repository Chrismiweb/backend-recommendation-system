const express = require('express');
const { registerUser, loginUser } = require('../controller/user.controller');
const { recommendation } = require('../openAIapi/api');
const router = express.Router()


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/recommendation').post(recommendation)
// router.route('/recommendation').post(recommend)


module.exports= router