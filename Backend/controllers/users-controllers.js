const { v4: uuid } = require('uuid'); //import the uuid package
const httpError = require('../models/http-error');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        email: 'max.schwarz@example.com',
        password: 'test123'
    },
    {
        id: 'u2',
        name: 'Manu',
        email: 'manu@example.com',
        password: 'test456'
    }   
];

const  getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS}); //send the Users array as a response
}

const login = (req, res, next) => { 
    const {email, password} = req.body; //get the email and password from the request body
    const identifiedUser = DUMMY_USERS.find(u => u.email === email); //find the User with the given email
    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new httpError('Could not identify User, credentials seem to be wrong', 401)); //if User is not found, return
    } //if User is not found, return a 401 error
    res.json({message: 'Logged in!'}); //send a response
}

const signup = (req, res, next) => {
    const {id, name, email, password} = req.body; //get the name, email and password from the request body
    const hasUser = DUMMY_USERS.find(u => u.email === email); //find the User with the given email
    if (hasUser) {
        return next(new httpError('Could not create User, email already exists.', 422)); //if User is found, return
    }
    const createdUser = {
        id: id || uuid(),
        name,
        email,
        password,
    }; //create a new User object
    
    DUMMY_USERS.push(createdUser); //add the new User to the Users array
    res.status(201).json({User: createdUser}); //send the new User as a response
}

const getUserById = (req, res, next) => {
    const userId = req.params.uid; //get the user id
    const user = DUMMY_USERS.find(u => {
        return u.id === userId;
    }); //find the user with the given id
    console.log('GET request in users route');
    if (!user) {
        return next(new httpError("Could not fid the user by the given id", 404)); //if user is not found, return
    } //if user is not found, return a 404 error
    res.json({user}); // send the user details as a response in json format {user: user details}
};

const createUser = (req, res, next) => {
    const { id, name, email} = req.body; 
    //get the title, description, coordinates, address and creator from the request body
    const createdUser = {
        id: id || uuid(),
        name,
        email,
    }; //create a new User object
    DUMMY_USERS.push(createdUser); //add the new User to the Users array
    res.status(201).json({User: createdUser}); //send the new User as a response
};

const updateUser = (req, res, next) => {
    const {name, email}  = req.body; //get the title and description from the request body
    const UserId = req.params.uid; //get the User id
    const updateUser = {...DUMMY_USERS.find(p => p.id === UserId)}; //make copy of DUMMY_USERS with the given id
    const UserIndex = DUMMY_USERS.findIndex(p => p.id === UserId); //get the index of the User
    updateUser.name = name; //update the title
    updateUser.email = email; //update the description
    DUMMY_USERS[UserIndex] = updateUser; //update the User in the Users array
    res.status(200).json({User: updateUser}); //send the updated User as a response
}

const deleteUser = (req, res, next) => {
    const UserId = req.params.uid; //get the User id
    console.log('DELETE request in Users route');
    DUMMY_USERS = DUMMY_USERS.filter(p => p.id !== UserId); //filter out the User with the given id
    res.status(200).json({message: 'Deleted User.' }); //send a response
}

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById; //export the getUserById function