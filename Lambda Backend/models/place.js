const mongoose = require('mongoose'); //import mongoose to connect to the database
const Schema = mongoose.Schema; //import Schema from mongoose to create a schema for the database

const placeSchema = new Schema({ //create a schema for the place
    title: { type: String, required: true},
    description: { type: String, required: true},
    image: { type: String, required: true }, //image of the place
    address: { type: String, required: true },
    location: { 
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }                            
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' } //reference to the user who created the place
});

module.exports = mongoose.model('Place', placeSchema); //export the model to use it in other files 
                                                       //('collection name', schema name)