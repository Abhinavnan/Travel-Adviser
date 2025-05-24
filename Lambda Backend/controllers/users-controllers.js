const { validationResult } = require('express-validator'); //import the express-validator package
const path = require('path'); //import path to use it in the file upload\
const bycrypt = require('bcryptjs'); //import bcrypt to hash the password
const jwt = require('jsonwebtoken'); //import jsonwebtoken to create a token
require('dotenv').config(); //import dotenv to use environment variables
const httpError = require('../models/http-error');
const User = require('../models/users'); //import the User model to use it in the database

const  getUsers = async (req, res, next) => {
    let users; 
    try {
        users = await User.find({}, '-password'); //find all the users in the database and exclude the password field
    }catch(err) {
        const error = new httpError('Fetching users failed, please try again later.', 500);
        return next(error); 
    } 
    res.json({users: users.map(user => user.toObject({getters: true}))}); 
}

const login = async (req, res, next) => { 
    const {email, password} = req.body; //get the email and password from the request body
    let existingUser; 
    try {
        existingUser = await User.findOne({email: email}); //find the User with the given email
    }catch(err) {
        const error = new httpError('Signing up failed, please try again later.', 500); 
        return next(error); 
    }
    
    if(!existingUser) { 
        const error = new httpError('User not exists, could not log you in.', 401); 
        return next(error); 
    } 

    let isValidPassword;
    try {
        isValidPassword = await bycrypt.compare(password, existingUser.password); //compare the password with the hashed password
    }catch(err){
        const error = new httpError('Could not log you in, please check your credentials and try again.', 500); 
        return next(error); 
    }
    
    if (!isValidPassword) { 
        const error = new httpError('Could not log you in, Invalid password', 401); 
        return next(error); 
    } //if password is not correct, return a 401 error
    let token;
    try {
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.JWT_KEY, {expiresIn: '7d'});
         //create a token with the user id and email
         // jwt.sign() takes 3 arguments, the payload, the secret key and the options
    }catch(err) {
        const error = new httpError('Signing up failed, please try again later.', 500); 
        return next(error); 
    } 

    res.status(200).json({userId: existingUser.id, email: existingUser.email, token: token });
}

const signup = async (req, res, next) => {
    const errors = validationResult(req); //validate the request
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new httpError('Invalid inputs passed, please check your data.', 422)); //if validation fails, return
    } //if validation fails, return a 422 error
    const {name, email, password,} = req.body; //get the name, email and password from the request body
    let existingUser; 
    try {
        existingUser = await User.findOne({email: email}); //find the User with the given email
    }catch(err) {
        const error = new httpError('Signing up failed, please try again later.', 500); 
        return next(error); 
    }
    
    if (existingUser) { 
        const error = new httpError('User exists already, please login instead.', 422); //if User is found, return a 422 error
        return next(error); //return the error
    } //if User is found, return a 422 error
    const imageUrl = req.file.location; //get the S3 URL of the uploaded image
    // On Windows, the filesystem uses backslashes (\) by default
    // but we want to use forward slashes (/) in our URLs
    // so we need to normalize the path to use forward slashes
    // req.file.path is the path to the file uploaded by multer middleware
    let hashedPassword;
    try {
        hashedPassword = await bycrypt.hash(password, 12); //hash the password with a salt of 12
    }
    catch(err) {
        const error = new httpError('Could not create user, please try again.', 500); 
        return next(error); 
    } 
    const createdUser = new User({ //create a new User object
        name,
        email,
        image: imageUrl, //set the image URL
        password: hashedPassword,
        places: []
    }); //create a new User object

    try {
        await createdUser.save(); //save the place to the database
    }catch(err) {
        const error = new httpError('Sign Up failed, please try again.', 500); //if error occurs, throw an error
        return next(error); //return the error for async function
    } //if error occurs, throw an error
    let token;
    try {
        token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_KEY, {expiresIn: '7d'});
         //create a token with the user id and email
         // jwt.sign() takes 3 arguments, the payload, the secret key and the options
    }catch(err) {
        const error = new httpError('Signing up failed, please try again later.', 500); 
        return next(error); 
    } 

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token }); //send the new User as a response
}
exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
