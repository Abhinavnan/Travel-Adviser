const jwt = require('jsonwebtoken'); //import the jsonwebtoken library
require('dotenv').config(); 
const httpError = require('../models/http-error'); 

const authCheck = (req, res, next) => {
    const authHeader = req.get('Authorization'); //get the authorization header from the request
    let decodedToken; 
    try {
        const token = authHeader.split(' ')[1]; //split the authorization header to get the token
        if (!token) { //if the token is not present
            return next(new httpError('Authentication failed, please login again.', 401)); //return a 401 error
        }
        decodedToken = jwt.verify(token, process.env.JWT_KEY); //verify the token with the secret key
    }catch(err) {
        return next(new httpError('Authentication failed, please login again.', 500)); 
    } 
    if (!decodedToken) { //if the token is not valid
        return next(new httpError('Authentication failed, please login again.', 401)); 
    } 
    req.userData = {userId: decodedToken.userId}; //set the user data in the request object
    next(); //call the next middleware function
 }

module.exports = authCheck; 
