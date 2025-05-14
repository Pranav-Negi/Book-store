const mongoose = require("mongoose")

const user = mongoose.Schema({
    name : {
        type : String,
        required: true, 
        lowercase : true,
        trim : true
    },
    email:{
        type: String,
        required: true, 
        lowercase : true,
        trim : true,
        unique: true
    }, 
    password:{
        type: String,
        required: true, 
        trim : true
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    },
    address:{
        address:String,
        city : String,
        state : String,
        postalcode : String
    },
    phoneno:{
        type : Number,
        required: true, 
        trim : true
    },
    books:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book"
    }]
}, { timestamps: true })

const User = mongoose.model("User" , user)
module.exports = User