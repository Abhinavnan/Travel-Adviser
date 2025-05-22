const axios = require('axios');
require('dotenv').config(); //import the dotenv package to use environment variables
const httpError = require('../models/http-error'); //import the httpError model
const API = process.env.REACT_APP_GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API}`);
    //get the response from the google api
    // encodeURIComponent() is used to encode the address so that it can be used in the url, 
    // it will remove white spaces and special characters from the address
    const data = response.data; //get the data from the response
    if (!data || data.status === 'ZERO_RESULTS') {
        throw new httpError('Could not find location for the specified address.', 422); //if data is not found, throw an error
    } //if data is not found, throw an error
    const coordinates = data.results[0].geometry.location; //get the coordinates from the data
    return coordinates; //return the coordinates
    
}

module.exports = getCoordsForAddress; //export the function