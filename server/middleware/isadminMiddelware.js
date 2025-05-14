const userSchema = require("../model/userSchema")

exports.isadmin = async (req , res , next) =>{

    const userid  = req.user

    const user = await userSchema.findById(userid)

    if(user && user.role === "admin"){
        next()
    }else{
        return res.status(500).json({message : "only admin can use these routes"})
    }

} 