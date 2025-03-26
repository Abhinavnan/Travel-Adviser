const express = require('express');
const route = express.Router(); //create a route object
const usersControlers = require('../controllers/users-controllers'); //import the users controller
const { post } = require('./places-route');

route.get('/', usersControlers.getUsers); //get request

route.get('/:uid', usersControlers.getUserById); //get request

route.post('/', usersControlers.createUser); //post request for creating a User

route.post('/login', usersControlers.login); //post request for login

route.post('/signup', usersControlers.signup); //post request for signup

route.patch('/:uid', usersControlers.updateUser); //patch request for updating a User

route.delete('/:uid', usersControlers.deleteUser); //delete request for deleting a User


module.exports = route; //export the route