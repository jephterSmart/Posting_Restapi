const express = require('express');
const {body} = require('express-validator/check');

const authController = require('../controllers/auth');
const Usermodel = require('../models/user');


const router = express.Router();

router.put('/signup',[
    body('email').isEmail().withMessage('Not a valid email').custom((value,{req}) => {
       return Usermodel.findOne({email: value})
        .then(result => {
            if(result) 
            return Promise.reject('User already exist with that email');
        })
    }).normalizeEmail(),
    body('password','password must be atleast 5 characters').trim().isLength({min:5}),
    body('name').trim().not().isEmpty()
],authController.signUp);

router.post('/login',authController.login)

module.exports = router;