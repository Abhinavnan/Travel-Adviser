const express = require('express');
const route = express.Router(); //create a route object
const { check } = require('express-validator'); //import the express-validator
const usersControlers = require('../controllers/users-controllers'); //import the users controller
const fileUpload = require('../middleware/file-upload'); //import the file upload middleware

const signupValidator = [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
]; //validate the request body
 // normalizeEmail() covert Test@gamil.com to test@gamil.com

route.get('/', usersControlers.getUsers); //get request

route.post('/login', usersControlers.login); //post request for login

route.post('/signup',fileUpload.single('image') ,signupValidator, usersControlers.signup); //post request for signup


module.exports = route; //export the route