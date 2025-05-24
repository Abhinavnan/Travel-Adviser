const { validationResult } = require('express-validator'); //import express-validator to validate the request
const mongoose = require('mongoose'); //import mongoose to connect to the database
const path = require('path'); //import path to use it in the file upload
const fs = require('fs'); //import fs to use the file system
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3'); 
require('dotenv').config(); 
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location'); //import the getCoordsForAddress function to get the coordinates for the address
const Place = require('../models/place'); //import the Place model to use it in the databasecon
const User = require('../models/users');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const getPlaceById = async  (req, res, next) => {
    const placeId = req.params.pid; //get the place id
    let place;
    try {
        place = await Place.findById(placeId); //find the place with the given id
    }catch(err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500); //if error occurs, throw an error
        return next(error); //return the error
    } 
    console.log('GET request in places route');
    if (!place) {
        const error = new HttpError('Could not find a place for the provided id.', 404); //if place is not found, throw an error
        return next(error); //return the error
    } //if place is not found, return a 404 error
    res.json({place: place.toObject({getters: true})}); // send the place details as a response in json format {place: place details}
                                                        // toObject() is used to convert the mongoose object to a plain javascript object
                                                        // getters: true is used to rename the _id field to id in the response
}; //get request for place by id 

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid; //get the user id
    let places;
    try {
        //places = await Place.find({creator: userId}); //find the places with the given user id
        const user = await User.findById(userId).populate('places');
        places = user.places;
    }catch(err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500); //if error occurs, throw an error
        return next(error); //return the error
    } 
    console.log('GET request in places route');
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404)); //if place is not found, return
    } //if place is not found, return
    res.json({places: places.map(place => place.toObject({getters: true}))}); // send the place details as a response in json format
                                                        // cannot use toOject() directly, because find() returns an array of objects
}; //get request for place by user id

const createPlace = async (req, res, next) => {
    const errors = validationResult(req); //validate the request
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.', 422)); //if validation fails, throw an error
    } //if validation fails, throw an error

    const { title, description, address } = req.body; 
    //get the title, description, coordinates, address and creator from the request body
    const creator = req.userData.userId; 
    let coordinates ; //get the coordinates for the address
    try {
        coordinates = await getCoordsForAddress(address); //get the coordinates for the address
    }catch(error){
        return next(error); //if error occurs, return the error
    }

    let user; 
    try {
        user = await User.findById(creator); //find the user with the given id
    }catch(err) {
        const error = new HttpError('Creating place failed, please try again.', 500); 
        return next(error); 
    } 

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error); 
    }    
    const imageUrl = req.file.location; //get the S3 URL of the uploaded image
    // On Windows, the filesystem uses backslashes (\) by default
    // but we want to use forward slashes (/) in our URLs
    // req.file.path is the path to the file uploaded by multer middleware
    const createdPlace = new Place({ //create a new place object
        title,
        description,
        image: imageUrl,
        address,
        location: coordinates, //set the coordinates
        creator //set the creator
    }); //create a new place object
    try {
        const session = await mongoose.startSession(); //start a session to save the place and user in the database
        session.startTransaction();
        await createdPlace.save({session: session});
        user.places.push(createdPlace);
        await user.save({session: session});
        await session.commitTransaction();
        // isolate the session to save the place and user in the database
        // if any error occurs, the transaction will be rolled back and the data will not be saved to the database
    }catch(err) {
        const error = new HttpError('Creating place failed, please try again.', 500); //if error occurs, throw an error
        return next(error); //return the error for async function
    } //if error occurs, throw an error
    const params = { Bucket: req.file.bucket, Key: req.file.key };
    //console.log(params);
    res.status(201).json({place: createdPlace}); //send the new place as a response
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req); //validate the request
    console.log('UPDATE request in places route');
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422); //if validation fails, throw an error
    } //if validation fails, throw an error
    
    const {title, description}  = req.body; //get the title and description from the request body
    const placeId = req.params.pid; //get the place id
    const userId = req.userData.userId; //get the user id from the request object
    let updatePlace;
    try {
        updatePlace = await Place.findById(placeId); //find the place with the given id
    }catch(err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500); //if error occurs, throw an error
        return next(error); //return the error
    } 
    if(updatePlace.creator.toString() !== userId){
        const error = new HttpError('You are not allowed to edit this place.', 401); 
        return next(error); 
    }

    updatePlace.title = title; //update the title
    updatePlace.description = description; //update the description

    try {
        await updatePlace.save(); //save the place to the database
    }catch(err) {
        const error = new HttpError('Creating place failed, please try again.', 500); //if error occurs, throw an error
        return next(error); //return the error for async function
    } //if error occurs, throw an error
    
    res.status(200).json({place: updatePlace.toObject({getters: true})}); //send the updated place as a response
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid; //get the place id
    const userId = req.userData.userId; 
    console.log('DELETE request in places route');
    let place; //create a place variable
    try {
        place = await Place.findById(placeId).populate('creator'); //find the place with the given id with the creator details
    }catch(err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500); //if error occurs, throw an error
        return next(error); //return the error
    }
    let title; 
    if(place){
        title = place.title; //get the title of the place
    }else{
        const error = new HttpError('Could not find a place.', 404);
        return next(error); 
    } 
    if(userId !== place.creator.id){
        const error = new HttpError('You are not allowed to delete this place.', 401); 
        return next(error);
    }

    const imageUrl = place.image; //get the image path of the place
    try {
        const session = await mongoose.startSession(); 
        session.startTransaction(); 
        await place.deleteOne({session: session}); 
        place.creator.places.pull(place); // remove place from the user
        await place.creator.save({session: session}); // update user database
        await session.commitTransaction(); 
    }catch(err) {
        const error = new HttpError('Deleting place failed, please try again.', 500); //if error occurs, throw an error
        return next(error); //return the error for async function
    } //if error occurs, throw an error
    const Bucket = process.env.S3_BUCKET_NAME; 
    const replaceUrl = 'https://'+ Bucket+ '.s3.' + process.env.AWS_REGION +  '.amazonaws.com/'
    const Key = imageUrl.replace(replaceUrl,'');
    const params = { Bucket: Bucket, Key: Key };
    try {
        await s3Client.send(new DeleteObjectCommand(params));
        console.log(`Successfully deleted S3 object: s3://${params.Bucket}/${params.Key}`);
    } catch (s3Err) {
        console.error(`ERROR: Failed to delete S3 object: s3://${params.Bucket}/${params.Key}`, s3Err);
    }

    res.status(200).json({message: 'Deleted place.', title}); //send a response
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;