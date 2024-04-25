
const express = require('express');
const multer = require('multer');
const path = require('path');
const userModel = require('./models/userModel')
const router = express.Router();
const status = require("./middleware/status")
const dataFunction = require('./function')
// Set up Multer to handle file uploads
async function saveLinkDB(req) {
    const usedata = await userModel.findById({ _id: req.body._id })
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    usedata.profile = baseUrl + "/Profile_pic/" + req.file.filename
    await usedata.save()
    const token = dataFunction.createJWTtoken(req, usedata)
    const dataD = { ...usedata._doc, tokenD: token }
    dataFunction.setSessionLogin(req, dataD)
    console.log(usedata)

}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'Profile_pic')); // Save files to public/img directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
        // saveLinkDB(req, uniqueSuffix, path.extname(file.originalname))
    }
});


const upload = multer({
    storage: storage
});
// Handle POST request to /upload
router.post('/', upload.single('file'), async (req, res) => {
    try {
        console.log(req.body._id, req.file.filename)
        await saveLinkDB(req)
        // If the file is uploaded successfully, send a response
        res.status(200).send({ message: 'File uploaded successfully' });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).send({ error: 'Error uploading file' });
    }
});

module.exports = router;