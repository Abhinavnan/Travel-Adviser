const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-route');
const HttpError = require('./models/http-error');

const app = express(); //create an express object

app.use(bodyParser.json()); //use the body parser middleware
app.use('/api/places', placesRoutes); //use the placesRoutes
app.use('/api/users', usersRoutes); //use the usersRoutes

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404); //create an error object
    throw error; //throw the error
}); //middleware for handling unknown routes

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    } //if response header is already sent, return the error
    res.status(error.code || 500); //set the status code of the response else set it to 500 server error
    res.json({message: error.message || 'An unknown error occurred!'}); //send the error message as a response
}); //error handling middleware

app.listen(5000); //listen to port 5000, without this the server will not run