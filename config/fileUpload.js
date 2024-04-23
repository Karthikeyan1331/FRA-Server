
const express = require('express');
const multer = require('multer');
const path = require('path');
const userModel = require('./models/userModel')
const router = express.Router();

// Set up Multer to handle file uploads
async function saveLinkDB(req, _id, extension) {
    const usedata = await userModel.findById({ _id })
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    usedata.profile = baseUrl + "/Profile_pic/" + _id + extension
    req.session.data.profile = usedata.profile
    await usedata.save()

}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(path.join(__dirname, '..', 'public', 'Profile_pic'))
        cb(null, path.join(__dirname, '..', 'public', 'Profile_pic')); // Save files to public/img directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = req.session.data._id;
        cb(null, uniqueSuffix + path.extname(file.originalname));
        saveLinkDB(req, uniqueSuffix, path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Handle POST request to /upload
router.post('/', upload.single('file'), (req, res) => {
    try {
        // If the file is uploaded successfully, send a response
        res.status(200).send({ message: 'File uploaded successfully' });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send({ error: 'Error uploading file' });
    }
});

module.exports = router;