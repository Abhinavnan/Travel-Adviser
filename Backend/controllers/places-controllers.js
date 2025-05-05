const { v4: uuid } = require('uuid'); //import uuid to generate unique ids
const { validationResult } = require('express-validator'); //import express-validator to validate the request
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location'); //import the getCoordsForAddress function to get the coordinates for the address
const Place = require('../models/place'); //import the Place model to use it in the database

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
        address: '20 W 34th St, New York, NY 10118, United States',
        location: {
            lat: 40.7484405,
            lng: -73.9878531
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Eiffel Tower',
        description: 'A wrought-iron lattice tower on the Champ de Mars in Paris, France.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',
        address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        location: {
            lat: 48.8583701,
            lng: 2.2922926
        },
        creator: 'u2'
    },
    {
        "id": "p3",
        "title": "Sydney Opera House",
        "description": "A multi-venue performing arts center in Sydney, Australia.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/41/Sydney_Opera_House_-_Dec_2008.jpg",
        "address": "Bennelong Point, Sydney NSW 2000, Australia",
        "location": {
            "lat": -33.8567844,
            "lng": 151.2152967
        },
        "creator": "u1"
    },
];

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
        places = await Place.find({creator: userId}); //find the places with the given user id
    }catch(err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500); //if error occurs, throw an error
        return next(error); //return the error
    } 
    console.log('GET request in places route');
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404)); //if place is not found, return
    } //if place is not found, return
    res.json({places: places.map((place) => place.toObject({getters: true}))}); // send the place details as a response in json format
                                                        // cannot use toOject() directly, because find() returns an array of objects
}; //get request for place by user id

const createPlace = async (req, res, next) => {
    const errors = validationResult(req); //validate the request
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.', 422)); //if validation fails, throw an error
    } //if validation fails, throw an error

    const { title, description, imageUrl, address, creator } = req.body; 
    //get the title, description, coordinates, address and creator from the request body

    let coordinates ; //get the coordinates for the address
    try {
        coordinates = await getCoordsForAddress(address); //get the coordinates for the address
    }catch(error){
        return next(error); //if error occurs, return the error
    }

    const createdPlace = new Place({ //create a new place object
        title,
        description,
        image: imageUrl,
        address,
        location: coordinates, //set the coordinates
        creator //set the creator
    }); //create a new place object
    try {
        await createdPlace.save(); //save the place to the database
    }catch(err) {
        const error = new HttpError('Creating place failed, please try again.', 500); //if error occurs, throw an error
        return next(error); //return the error for async function
    } //if error occurs, throw an error

    res.status(201).json({place: createdPlace}); //send the new place as a response
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req); //validate the request
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422); //if validation fails, throw an error
    } //if validation fails, throw an error
    
    const {title, description}  = req.body; //get the title and description from the request body
    const placeId = req.params.pid; //get the place id
    let updatePlace;
    try {
        updatePlace = await Place.findById(placeId); //find the place with the given id
    }catch(err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500); //if error occurs, throw an error
        return next(error); //return the error
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
    console.log('DELETE request in places route');
    let place; //create a place variable
    try {
        place = await Place.findById(placeId); //find the place with the given id
    }catch(err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500); //if error occurs, throw an error
        return next(error); //return the error
    }
    let title; 
    if(place){
        title = place.title; //get the title of the place
    }
    try {
        await place.deleteOne(); //delete the place to the database
    }catch(err) {
        const error = new HttpError('Deleting place failed, please try again.', 500); //if error occurs, throw an error
        return next(error); //return the error for async function
    } //if error occurs, throw an error

    res.status(200).json({message: 'Deleted place.', title}); //send a response
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;