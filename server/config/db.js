const mongoose = require("mongoose")

const connection = () =>{
    mongoose.connect(process.env.URI).then(()=>{
        console.log("db is connected")
    })
}

module.exports = connection