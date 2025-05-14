const jwt = require("jsonwebtoken")

exports.protect = async(req , res ,next) => {
    const auth  = req.headers.authorization
    try{
        if (!auth) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }
        
        const decode = jwt.verify(auth , process.env.JWT)        
        req.user = decode.id
        next()
    }catch(error){
        console.log(error)
        return res.status(401).json({ message: "Token is not valid" , error: error.message });
    }

}