const express = require('express');
const route = express.Router(); //create a route object
const placesControllers = require('../controllers/places-controllers'); //import the places controller

route.get('/:pid', placesControllers.getPlaceById); //get request for place by id

route.get('/user/:uid', placesControllers.getPlacesByUserId ); //get request for place by user id

route.post('/', placesControllers.createPlace); //post request for creating a place

route.patch('/:pid', placesControllers.updatePlace); //patch request for updating a place

route.delete('/:pid', placesControllers.deletePlace); //delete request for deleting a place

module.exports = route; //export the route