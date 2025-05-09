const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //import mongoose to connect to the database
const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-route');
const HttpError = require('./models/http-error');

const app = express(); //create an express object
const url = 'mongodb+srv://lamboavancher7:WIrDKbv6pKK7kNRx@mustilago.ig2fpjn.mongodb.net/Places?retryWrites=true&w=majority&appName=Mustilago';

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

mongoose.connect(url) //connect to the database
    .then(() => {
        app.listen(5000); //listen to port 5000, without this the server will not run
    })
    .catch(err => {
        console.log(err); //log the error if any
    }); //catch any errors while connecting to the database