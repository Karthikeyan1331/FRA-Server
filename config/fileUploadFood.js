
const express = require('express');
const multer = require('multer');
const path = require('path');
const userModel = require('./models/userModel')
const router = express.Router();
const status = require("./middleware/status")
const dataFunction = require('./function')
const Dashboard = require("./Dashboard")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'food_pic')); // Save files to public/img directory
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

    if (req.file) {
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        let temp = { ...req.body, Image: baseUrl + "/food_pic/" + req.file.filename }
        if (req.body.food_id) {
            console.log("Edit data with Image")
            try {
                let data = await Dashboard.editFood(temp)
                if (data[0]) {
                    res.status(200).json(data[1])
                }
                else {
                    res.status(201).json({ data: data[1], message: false })
                }

            }
            catch (error) {
                console.log(error)
                res.status(500).json({ error })
            }
        }
        else {
            console.log("Create data with Image")
            try {
                let data = await Dashboard.createFood(temp)
                if (data[0]) {
                    res.status(200).json(data[1])
                }
                else {
                    res.status(201).json({ data: data[1], message: false })
                }

            }
            catch (error) {
                console.log(error)
                res.status(500).json({ error })
            }
        }
    }
    else {
        if (req.body.food_id) {
            try {
                console.log("Edit data without Image")
                let data = await Dashboard.editFood(req.body)
                if (data[0]) {
                    res.status(200).json(data[1])
                }
                else {
                    res.status(201).json({ data: data[1], message: false })
                }

            }
            catch (error) {
                console.log(error)
                res.status(500).json({ error })
            }
        }
        else if (req.body._id) {
            res.status(400).send({ error: "Image Not Upload" })
        }
        else {
            res.status(500).send({ error: 'Error uploading file' });
        }
    }
});

module.exports = router;