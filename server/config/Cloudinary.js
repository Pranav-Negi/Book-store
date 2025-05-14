const cloudinary = require("cloudinary").v2

cloudinary.config({
        cloud_name: "dh72e6lqz",
        api_key : process.env.cloud_key,
        api_secret : process.env.cloud_sceret
})

module.exports = cloudinary