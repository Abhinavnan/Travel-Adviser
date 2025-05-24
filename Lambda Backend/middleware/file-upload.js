const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3'); // For AWS SDK V3
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
require('dotenv').config(); 

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// 1. Configure your S3 client
//    Ensure your Lambda execution role has permissions for S3 (s3:PutObject, s3:GetObject, etc.)
//    No need to provide credentials here if Lambda has an IAM role with S3 access.
const s3 = new S3Client({ region: process.env.AWS_REGION });

const fileUpload = multer({
    limits: 1000000, // 1MB limit (for the file itself, not the multipart request)
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME, // <<<--- IMPORTANT: Set this as an environment variable in Lambda
        //acl: 'public-read', // Or 'private', depending on your needs. 'public-read' makes it accessible via URL.
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Generate a unique file name for S3
            const ext = MIME_TYPE_MAP[file.mimetype];
            if (!ext) {
                return cb(new Error('Invalid file type'), null); // Handle invalid mimetype earlier if not caught by fileFilter
            }
            cb(null, `images/${uuid()}.${ext}`); // Store in an 'images' folder in your S3 bucket
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid file type');
        cb(error, isValid);
    }
});

module.exports = fileUpload;