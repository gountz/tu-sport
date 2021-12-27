const nodemailer = require('nodemailer');
module.exports = {
    transporter: nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.TOKEN
        }
    })
}