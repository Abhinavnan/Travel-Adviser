const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //import mongoose to connect to the database
const cors = require('cors'); //import cors to enable cross-origin resource sharing
const fs = require('fs'); //import fs to use the file system
require('dotenv').config(); //import dotenv to use environment variables
const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-route');
const HttpError = require('./models/http-error');

const app = express(); //create an express object
const url = process.env.MONGO_URL; //get the mongo url from the environment variables

app.use(bodyParser.json()); //use the body parser middleware
app.use(cors()); 
app.use('/Uploads/Images', express.static('Uploads/Images')); 
//use the static middleware to serve the images from the uploads/images folder

app.use('/api/places', placesRoutes); //use the placesRoutes
app.use('/api/users', usersRoutes); //use the usersRoutes

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404); //create an error object
    throw error; //throw the error
}); //middleware for handling unknown routes

app.use((error, req, res, next) => {
    if (req.file) { 
        fs.unlink(req.file.path, err => { 
            console.log(err); 
        });
    } //if there is an error while saving data to the database, delete the file also
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