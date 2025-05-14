const nodemailer = require("nodemailer")

const tranporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user: process.env.USER,
        pass : process.env.PASSWORD
    }
})

module.exports = tranporter