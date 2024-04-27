const app = require("../app");
const { secureHeapUsed } = require('crypto');
const sendEmail = require('./email');
const dataFunction = require('./function')
const fileUpload = require('./fileUpload');
const fileUploadFood = require('./fileUploadFood')
const signInWithGoogle = require('./signWithGoogle');
const passport = require("passport")
const searchClass = require("./search")
const EditFunction = require("./method/editUserdata")
const status = require("./middleware/status")
const History = require("./History")
const Dashboard = require("./Dashboard")
const Admin = require("./Admin")
app.use('/Editprofile', fileUpload);
app.use('/AddEditFood', fileUploadFood)
const ServerCall = async (collection, data) => {
    const port = 8000;
    // Admin Req dude
    app.post('/api/FetchAllRport', status, async (req, res) => {
        if (req.user_data && req.user_data.admin) {
            try {
                let data = await Admin.fetchReport(req)
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
            res.status(404).json({ error: "You are not a Admin" })
        }
    })
    app.post('/api/FetchAllFoodWaiting', status, async (req, res) => {
        if (req.user_data && req.user_data.admin) {
            try {
                let data = await Admin.fetchFoodInWaiting(req)
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
            res.status(404).json({ error: "You are not a Admin" })
        }
    })
    app.post('/api/Approve', status, async (req, res) => {
        if (req.user_data && req.user_data.admin) {
            try {
                let data = await Admin.ApproveFood(req)
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
            res.status(404).json({ error: "You are not a Admin" })
        }
    })
    app.post('/api/Reject', status, async (req, res) => {
        if (req.user_data && req.user_data.admin) {
            try {
                let data = await Admin.RejectFood(req)
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
            res.status(404).json({ error: "You are not a Admin" })
        }
    })
    //Create Dashboard
    app.post('/api/myFood', status, async (req, res) => {
        try {
            let data = await Dashboard.collectMyFood(req)
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

    })
    // History
    app.post('/api/HistoryBookmaks', status, async (req, res) => {
        try {
            let data = await History.bookmarks(req)
            if (data[0]) {
                res.status(200).json({ data: data[1], message: true })
            }
            else {
                res.status(201).json({ data: data[1], message: false })
            }

        }
        catch (error) {
            console.log(error)
            res.status(500).json({ error })
        }
    })
    app.post('/api/HistoryLikes', status, async (req, res) => {
        try {
            let data = await History.likes(req)
            if (data[0]) {
                res.status(200).json({ data: data[1], message: true })
            }
            else
                res.status(201).json({ data: data[1], message: false })

        }
        catch (error) {
            console.log(error)
            res.status(500).json({ error })
        }
    })
    app.post('/api/HistoryViews', status, async (req, res) => {
        try {
            let data = await History.views(req)
            if (data[0]) {
                res.status(200).json({ data: data[1], message: true })
            }
            else
                res.status(201).json({ data: data[1], message: false })

        }
        catch (error) {
            console.log(error)
            res.status(500).json({ error })
        }
    })

    //.Carosel home
    app.post('/api/FoodInstruction', async (req, res) => {
        if (req.body.id) {
            let data = await dataFunction.foodInstructionData(req, req.body.id)
            res.status(200).json(data)
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })

    app.post('/EditFoodGetData', status, async (req, res) => {
        if (req.body.id) {
            let data = await dataFunction.foodInstructionData(req, req.body.id)
            console.log(data)
            res.status(200).json(data)
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })
    app.post('/Delete_Food', status, async (req, res) => {
        if (req.body._id) {
            let data = await Dashboard.deleteFood(req)
            console.log(data)
            res.status(200).json(data)
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })

    //Liked routes

    app.post('/api/UserLiked', status, async (req, res) => {
        if (req.body.id) {
            let data = await dataFunction.userLikedNot(req.body.id, true, req, 'FoodLikes')
            console.log(data, "output")
            res.status(200).json({ existed: data })
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })
    app.post('/api/getAboutLike', status, async (req, res) => {

        if (req.body.id) {
            let data = await dataFunction.getFoodLikes(req.body.id, req, 'FoodLikes')

            res.json({ count: data[0], existed: data[1] })
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })
    //Views
    app.post('/api/FoodViews', status, async (req, res) => {
        if (req.body.id) {
            let data = await dataFunction.userViewedFood(req.body.id, req)
            if (data[0])
                res.status(200).json(data[1])
            else
                res.status(201).json([])
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })
    //Bookmark
    app.post('/api/UserBookMarked', status, async (req, res) => {
        if (req.body.id) {
            let data = await dataFunction.userLikedNot(req.body.id, req.body.onClickBook, req, 'FoodBookmark')
            console.log(data, "output")
            res.status(200).json({ existed: data })
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })
    //Comments
    app.post('/api/InstructionsComments', status, async (req, res) => {
        if (req.body.id) {
            let data = await dataFunction.getFoodComments(req.body.id, req)
            console.log(data, "Comments")
            res.status(200).json({ data })
        }
        else {
            res.status(400).json({ message: "I can't get the FoodId" })
        }
    })
    app.post('/api/InsertComments', status, async (req, res) => {
        if (req.body.id) {
            let data = await dataFunction.setFoodUserComments(req.body.id, req.body.comments, req)
            res.status(200).json({ data })
        }
        else {
            res.status(400).json({ message: "Need to Have Food_id and User_email" })
        }
    })
    //Report
    app.post('/api/sendReport', status, async (req, res) => {
        console.log("shit")
        if (req.body.idValue) {
            console.log(req.body)
            let data = await dataFunction.sendReport(req)
            if (data)
                res.status(200).json({ status: true, message: "Successfully filed your Complain" })
            else
                res.status(400).json({ status: true, message: "your Complain not filed" })
        }
        else {
            res.status(400).json({ message: "Need to Have Food_id and User_email" })
        }
    })

    app.post('/api/hello', async (req, res) => {
        const { message } = req.body;

        if (message === 'hello') {
            const responses1 = await collection.find({}).skip(0).limit(20).toArray()
            res.json(responses1);
        } else {
            res.status(400).json({ error: 'Invalid message' });
        }
    });
    app.post('/ValidToken', (req, res) => {
        if (req.session.email) {
            return res.json({ valid: true, message: req.session.data })
        }
        else {
            return res.json({ valid: false, message: "wasted" })
        }
    })
    //Search default
    app.post('/api/search', async (req, res) => {
        await searchClass.searchData(req, res, collection)
    });

    app.get('/cookie', (req, res) => {
        res.cookie('mykey', 'myvalue', {
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.send('cookie has been set!')
    })
    //Re-Send Email to user
    app.post('/api/VerifyUser', async (req, res) => {
        try {
            const userCredential = req.body.token;
            console.log(userCredential)
            const verified = await dataFunction.verifyUser(userCredential)
            if (verified.success == true) {
                res.status(201).json({ success: true })
            }
            else {
                console.log(verified.message)
            }
        }
        catch (error) {
            console.error(error)
        }
    })
    app.post('/api/UserLogin', async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await dataFunction.checkUserIdPassword(req, email, password)
            if (!result.status) {
                res.status(201).json({ success: false, message: result.message })
            }
            else {
                res.status(201).json({ success: true, message: req.session.email })
            }
        }
        catch (error) {
            console.log(error)
        }
    })

    // GET route for Google OAuth2 authentication
    app.get("/auth/google", passport.authenticate("google", ["profile", "email"]));

    // Google OAuth2 callback route
    app.get("/auth/google/callback", passport.authenticate("google", {
        successRedirect: "/login/success", // Redirect to success page after authentication
        failureRedirect: "/login/failure"  // Redirect to failure page if authentication fails
    }));

    // Success route after Google OAuth2 authentication
    app.get("/login/success", async (req, res) => {
        if (req.user) {
            // User is authenticated, you can handle success logic here
            // res.json({ success: true, user: req.user });
            console.log("i am waiting")
            await signInWithGoogle.signWithGoogle(req, res);
        } else {
            res.status(403).json({ error: true, message: "Not Authorized" });
        }
    });

    // Failure route after Google OAuth2 authentication
    app.get("/login/failure", (req, res) => {
        res.status(401).json({ error: true, message: "Login failure" });
    });

    app.post('/api/reSendMail', async (req, res) => {
        try {
            const userCredential = req.body.user;
            console.log(userCredential)
            let result = await dataFunction.checkEmailVerified(userCredential.email)
            if (!result) {
                await sendEmail(userCredential);
                res.status(201).json({ success: true, userCredential })
            }
            else {
                res.status(201).json({ success: false, message: 'Login' })
            }
        }
        catch (error) {

        }
    })
    //User_Send
    app.post('/api/Login', async (req, res) => {
        try {
            const userCredential = req.body;
            console.log(userCredential.isRegisterActive)
            if (userCredential.isRegisterActive) {
                userCredential.verification = 0;
                await dataFunction.register_user(userCredential, req, res);
            }
            else {
                console.log("world fucks up")
            }
        } catch (error) {
            // Handle any errors that occur during the request processing
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    });
    app.post('/EditUserData', status, async (req, res) => {
        try {
            let data = await EditFunction.editFunction(req)
            if (data[0]) {
                res.status(200).json({ data: data[1], message: "success" })
            } else {
                res.status(201).json({ data: data[0], message: "failure" })
            }
        } catch (error) {
            console.log(error)
        }
    })

    app.post('/logout', async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                // Handle session destruction error
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'Logout failed' });
            }
            // Session destroyed successfully
            return res.status(200).json({ success: true, message: 'Logout successful' });
        });
    })
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = ServerCall;