const mongoose = require("mongoose")
const User = require("./userSchema")

const cart = mongoose.Schema({
    Userid:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
        unique : true
    },

    items: [
        {
            bookid : {
                type: mongoose.Schema.Types.ObjectId,
                required : true,
                ref :"Book"
            },
            price :{
                type: Number,
                required : true,
            },
            quantity :{
                type: Number,
                required:true,
                min : 1 
            }
        }
    ],
    discount:{
        type:Number,
        default:0
    },
    
    updatedAt :{
        type:Date,
        Data : Date.now
    }
})



module.exports = mongoose.model("Cart" , cart)