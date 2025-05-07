const { validationResult } = require('express-validator'); //import the express-validator package
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
    
    if (existingUser.password !== password) { 
        const error = new httpError('Could not log you in, Invalid password', 401); 
        return next(error); 
    } //if password is not correct, return a 401 error
    const name = existingUser.name; //get the name of the User
    res.json({message: 'Logged in!' , name}); //send a response
}

const signup = async (req, res, next) => {
    const errors = validationResult(req); //validate the request
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new httpError('Invalid inputs passed, please check your data.', 422)); //if validation fails, return
    } //if validation fails, return a 422 error
    const {name, email, password, image} = req.body; //get the name, email and password from the request body
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

    const createdUser = new User({ //create a new User object
        name,
        email,
        image,
        password,
        places: []
    }); //create a new User object

    try {
        await createdUser.save(); //save the place to the database
    }catch(err) {
        const error = new httpError('Sign Up failed, please try again.', 500); //if error occurs, throw an error
        return next(error); //return the error for async function
    } //if error occurs, throw an error

    res.status(201).json({User: createdUser.toObject({getters: true})}); //send the new User as a response
}
exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
