const mongoose = require('mongoose'); //import mongoose to connect to the database
const uniqueValidator = require('mongoose-unique-validator'); //import uniqueValidator to make the email field unique
const Schema = mongoose.Schema; //import Schema from mongoose to create a schema for the database

const userSchema = new Schema({ //create a schema for the place
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true}, 
    image: { type: String, required: true }, 
    password: { type: String, required: true, minlength: 6 }, 
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }] //reference to the places created by the user
});
// unique: true will index email field and make it faster to query

userSchema.plugin(uniqueValidator); //use the uniqueValidator plugin to make the email field unique

module.exports = mongoose.model('User', userSchema); //export the model to use it in other files 
                                                       //('collection name', schema name)