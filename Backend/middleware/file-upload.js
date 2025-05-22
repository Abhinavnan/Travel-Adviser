const multer = require('multer');
const path = require('path'); //import path to use it in the file upload
const uuid = require('uuid').v4; //import uuid to generate a unique id for the file

const MIME_TYPE_MAP = { //map the mime types to the file extensions
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}; //create a map of mime types to file extensions

const fileUpload = multer({
    limits: 1000000, //limit the file size to 1MB
    storage: multer.diskStorage({ //store the file in the disk
        destination: (req, file, cb) => {
            cb(null, 'Uploads/Images'); //set the destination to uploads/images
            // cb: callback function
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname); //get the extension of the file
            cb(null, uuid() + ext); //set the filename to unique id + original file extension
        }
    }),
    fileFilter: (req, file, cb) => { //filter the files
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; //check if the file is valid
        // !! converts the value to boolean, to ignore undefined value
        let error = isValid ? null : new Error('Invalid file type'); //if the file is not valid, set the error
        cb(error, isValid); //call the callback function with the error and isValid value
    }
}); //create a multer object

module.exports = fileUpload;