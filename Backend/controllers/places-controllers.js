const { v4: uuid } = require('uuid'); //import uuid to generate unique ids
const HttpError = require('../models/http-error');

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

const getPlaceById =  (req, res, next) => {
    const placeId = req.params.pid; //get the place id
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    }); //find the place with the given id
    console.log('GET request in places route');
    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404); //if place is not found, throw an error
    } //if place is not found, return a 404 error
    res.json({place}); // send the place details as a response in json format {place: place details}
}; //get request for place by id 

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid; //get the user id
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    }); //find the place with the given user id
    console.log('GET request in places route');
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404)); //if place is not found, return
    } //if place is not found, return
    res.json({places}); // send the place details as a response in json format
}; //get request for place by user id

const createPlace = (req, res, next) => {
    const { id, title, description, imageUrl, location, address, creator } = req.body; 
    //get the title, description, coordinates, address and creator from the request body
    const createdPlace = {
        id: id || uuid(),
        title,
        description,
        imageUrl,
        location,
        address,
        creator
    }; //create a new place object
    DUMMY_PLACES.push(createdPlace); //add the new place to the places array
    res.status(201).json({place: createdPlace}); //send the new place as a response
};

const updatePlace = (req, res, next) => {
    const {title, description}  = req.body; //get the title and description from the request body
    const placeId = req.params.pid; //get the place id
    const updatePlace = {...DUMMY_PLACES.find(p => p.id === placeId)}; //make copy of DUMMY_PLACES with the given id
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId); //get the index of the place
    updatePlace.title = title; //update the title
    updatePlace.description = description; //update the description
    DUMMY_PLACES[placeIndex] = updatePlace; //update the place in the places array
    res.status(200).json({place: updatePlace}); //send the updated place as a response
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid; //get the place id
    console.log('DELETE request in places route');
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId); //filter out the place with the given id
    res.status(200).json({message: 'Deleted place.' }); //send a response
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;