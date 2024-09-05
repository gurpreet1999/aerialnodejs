const express = require('express');
const s3Controller = require('../../Controller/AwsS3Controller/awsS3UploaderApi')

const router = express.Router();
const {uploadPreSignedUrl,viewObjectPresignedUrl} = s3Controller;

router.get('/getImageURL/:key', viewObjectPresignedUrl);
router.post('/uploadImage',uploadPreSignedUrl);

module.exports = router;