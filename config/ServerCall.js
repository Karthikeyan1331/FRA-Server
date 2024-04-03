const userModel = require('./models/userModel')
const userRegister = require("./UserRegister")
const app = require("../app");
const { secureHeapUsed } = require('crypto');
const sendEmail = require('./email');
const dataFunction = require('./function')
const signInWithGoogle = require('./signWithGoogle');
const passport = require("passport")
const buildRegexConditions = (fields, searchMessage) => {
    return fields.map(field => ({
        [field]: { $in: searchMessage.map(substring => new RegExp(substring, 'i')) }
    }));
};

async function register_user(userCredential, req, res) {
    console.log("you are here1")
    try {
        const { firstName, lastName, email, password } = userCredential
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(201).json({
                success: false,
                message: "EmailExisted"
            });
        }
        console.log("you are here2")


        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password,
        })
        console.log("you are here3")
        const tokenizer = user.getJwtToken();
        console.log(tokenizer)
        console.log("you are here4")

        console.log("you are here5")
        user.tokenizer = tokenizer;
        console.log(tokenizer)
        await user.save();
        await sendEmail(user);
        // await userModel.findOneAndDelete({ email: userCredential.email });
        //Code the email sender here
        res.status(201).cookie('Token', tokenizer, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
        }).json(
            { user, success: true }
        )
        // Remove the response sending from here

    }
    catch (error) {
        await userModel.findOneAndDelete({ email: userCredential.email });
        res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR"
        });
    }
}
const ServerCall = async (collection, data) => {
    const port = 8000;

    //.Carosel home
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
        console.log(req.session, 'here')
        if (req.session.username) {
            return res.json({ valid: true, message: req.session.username })
        }
        else {
            return res.json({ valid: false, message: "wasted" })
        }
    })
    //Search default
    app.post('/api/search', async (req, res) => {
        let { message, currentPage, perPage } = req.body;
        let searchMessage = message
        if (searchMessage === 'search') {
            const responses = await collection.find({}).skip((currentPage - 1) * perPage).limit(perPage).toArray()
            const count = await collection.countDocuments();
            res.json({ datavalue: responses, totalCount: count });
        } else {
            // Convert to array if it's a string
            if (typeof searchMessage === 'string') {
                searchMessage = searchMessage.split(' ');
            }

            const fieldsToSearch = ['TranslatedRecipeName', 'Cuisine', 'Course', 'Diet']; // Add more fields as needed
            const orConditions = buildRegexConditions(fieldsToSearch, searchMessage);

            const count = await collection.countDocuments({
                $or: orConditions,
            });
            const searchResult = await collection.find({
                $or: orConditions,
            }).toArray();

            // Sort the search results based on the number of matches
            searchResult.sort((a, b) => {
                const matchesA = countMatches(a);
                const matchesB = countMatches(b);
                return matchesB - matchesA;
            });

            function countMatches(doc) {
                let count = 0;
                for (const field of Object.values(doc)) {
                    if (Array.isArray(field)) {
                        count += field.filter(value => searchMessage.some(substring => value.toLowerCase().includes(substring.toLowerCase()))).length;
                    } else {
                        count += searchMessage.filter(substring => new RegExp(substring, 'i').test(field)).length;
                    }
                }
                return count;
            }
            // Move the recipes with more matches in 'TranslatedRecipeName' to the top
            searchResult.sort((a, b) => {
                const matchesA = countMatchesForField(a, 'TranslatedRecipeName', searchMessage);
                const matchesB = countMatchesForField(b, 'TranslatedRecipeName', searchMessage);
                return matchesB - matchesA;
            });
            const responses1 = searchResult.slice((currentPage - 1) * perPage, ((currentPage - 1) * perPage) + perPage).map((a) => {
                return a;
            });
            res.json({ datavalue: responses1, totalCount: count });
        }
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
            const result = await dataFunction.checkUserIdPassword(email, password)
            if (!result.status) {
                res.status(201).json({ success: false, message: result.message })
            }
            else {
                req.session.username = email
                console.log(req.session.username)
                res.status(201).json({ success: true, message: req.session.username })
            }
        }
        catch (error) {
            console.log(error)
        }
    })
    app.post('/api/SignInWithGoogle', async (req, res) => {
        signInWithGoogle.signWithgoogle(req, res)
    })
    // POST route to fetch Google Client ID
    app.post('/getGoogleClientId', (req, res) => {
        res.json({ Client_ID: process.env.GOOGLE_CLIENT_ID });
    });

    // GET route for Google OAuth2 authentication
    app.get("/auth/google", passport.authenticate("google", ["profile", "email"]));

    // Google OAuth2 callback route
    app.get("/auth/google/callback", passport.authenticate("google", {
        successRedirect: "/login/success", // Redirect to success page after authentication
        failureRedirect: "/login/failure"  // Redirect to failure page if authentication fails
    }));

    // Success route after Google OAuth2 authentication
    app.get("/login/success", (req, res) => {
        if (req.user) {
            // User is authenticated, you can handle success logic here
            res.json({ success: true, user: req.user });
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
            // Extract user credentials from the request body
            const userCredential = req.body;
            console.log(userCredential.isRegisterActive)
            if (userCredential.isRegisterActive) {
                // Perform any necessary processing, such as setting verification flag
                userCredential.verification = 0;

                // Call a function to handle user registration/login logic
                await register_user(userCredential, req, res);
            }
            else {
                console.log("world was fucked")
            }

            console.log("LAst")


            // Respond with a success message


        } catch (error) {
            // Handle any errors that occur during the request processing
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    });

    function countMatchesForField(doc, field, searchMessage) {
        let count = 0;
        const fieldValue = doc[field];
        if (Array.isArray(fieldValue)) {
            count += fieldValue.filter(value => searchMessage.some(substring => value.toLowerCase().includes(substring.toLowerCase()))).length;
        } else {
            count += searchMessage.filter(substring => new RegExp(substring, 'i').test(fieldValue)).length;
        }
        return count;
    }
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