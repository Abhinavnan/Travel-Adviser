const { v4: uuid } = require('uuid'); //import the uuid package
const { validationResult } = require('express-validator'); //import the express-validator package
const httpError = require('../models/http-error');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        email: 'max.schwarz@example.com',
        password: 'test123'
    },
    {
        id: 'u2',
        name: 'Manu',
        email: 'manu@example.com',
        password: 'test456'
    }   
];

const  getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS}); //send the Users array as a response
}

const login = (req, res, next) => { 
    const {email, password} = req.body; //get the email and password from the request body
    const identifiedUser = DUMMY_USERS.find(u => u.email === email); //find the User with the given email
    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new httpError('Could not identify User, credentials seem to be wrong', 401)); //if User is not found, return
    } //if User is not found, return a 401 error
    res.json({message: 'Logged in!'}); //send a response
}

const signup = (req, res, next) => {
    const errors = validationResult(req); //validate the request
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new httpError('Invalid inputs passed, please check your data.', 422)); //if validation fails, return
    } //if validation fails, return a 422 error
    const {id, name, email, password} = req.body; //get the name, email and password from the request body
    const hasUser = DUMMY_USERS.find(u => u.email === email); //find the User with the given email
    if (hasUser) {
        return next(new httpError('Could not create User, email already exists.', 422)); //if User is found, return
    }
    const createdUser = {
        id: id || uuid(),
        name,
        email,
        password,
    }; //create a new User object
    
    DUMMY_USERS.push(createdUser); //add the new User to the Users array
    res.status(201).json({User: createdUser}); //send the new User as a response
}
exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
