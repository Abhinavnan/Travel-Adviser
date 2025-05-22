const express = require('express');
const route = express.Router(); //create a route object
const { check } = require('express-validator'); //import the express-validator
const placesControllers = require('../controllers/places-controllers'); //import the places controller
const fileUpload = require('../middleware/file-upload'); //import the file upload middleware
const authCheck = require('../middleware/auth-check'); //import the auth check middleware

const createValidator = [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty()
];
const updateValidator = [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
];

route.get('/:pid', placesControllers.getPlaceById); //get request for place by id

route.get('/user/:uid', placesControllers.getPlacesByUserId ); //get request for place by user id

route.use(authCheck); //use the auth check middleware for all the routes below
// protect the routes below with auth check middleware

route.post('/',fileUpload.single('image'), createValidator, placesControllers.createPlace); //post request for creating a place

route.patch('/:pid', updateValidator, placesControllers.updatePlace); //patch request for updating a place

route.delete('/:pid', placesControllers.deletePlace); //delete request for deleting a place

module.exports = route; //export the route