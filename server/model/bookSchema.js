const mongoose=require("mongoose");

const book = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        default:""
    },
    price:{
        type: Number,
        required : true
    }, 
    discount:{
        type:Number,
        default: 0,
    },
    stock:{
        type:Number,
        default : 1
    },  
    category:{
        type:[String],
        require: true,
        validate : [arr => arr.length > 0 ,"At least have one category"]
    },
    ratings:{
        type:Number,
        default:0,
        min:0,
        max : 5
    },
    numReviews:{
        type: Number,
        default:0
    },
    reviews:[ 
        {
            Userid: { type : mongoose.Schema.Types.ObjectId , ref : "User"},
            rating: Number,
            comment : String,
        }
    ],
    coverimage:{
        public_id : String,
        url : String
    },
    gallery:[
        {
            public_id:String,
            url:String
        }
    ],
    uploadedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:"true"
    }
},{timestamps : true});

module.exports = mongoose.model("Book" , book)