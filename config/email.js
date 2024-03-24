const nodemailer = require('nodemailer');

const sendEmail = async (email, token) => {
    // Create a Nodemailer transporter
    const emailAddress = process.env.EMAIL_ADDRESS;
    const emailPassword = process.env.EMAIL_PASSWORD;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailAddress,
            pass: emailPassword
        }
    });

    // Define email options
    const mailOptions = {
        from: emailAddress,
        to: email,
        subject: 'Verification Email',
        text: `Please click on the following link to verify your email: http://localhost:3000/verify?token=${token}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;