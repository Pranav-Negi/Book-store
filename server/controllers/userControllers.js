const userSchema = require("../model/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    const { name, email, password, role ,phoneno ,address ,city,state,postalcode} = req.body;

    // Validate input
    if (!name || !email || !password || !role || !phoneno ||!address || !city || !state || !postalcode) {
        return res.status(400).json({ message: "All details are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(301).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(typeof(hashedPassword) , hashedPassword)

        // Create the user
        const usercreate = await userSchema.create({
            name,
            email,
            password: hashedPassword,
            role,
            phoneno,
            address:{
                address,
                city,
                state,
                postalcode
            }
        });

        // Respond with success
        return res.status(200).json({
            message: "User created successfully",
            data: usercreate
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const useremail = await userSchema.findOne({ email });
        if (!useremail) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        console.log("password in DB:",useremail.password)

        // Compare passwords
        const match = await bcrypt.compare(password.trim(), useremail.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Check if JWT secret is defined
        if (!process.env.JWT) {
            return res.status(500).json({ message: "JWT secret is not configured" });
        }

        // Generate JWT token
        const webtoken = jwt.sign(
            { id: useremail._id },
            process.env.JWT,
            { expiresIn: "6h" }
        );

        // Respond with success
        return res.status(200).json({
            message: "Login successfully",
            token: webtoken,
            id: useremail._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

exports.profile = async(req,res)=>{
    const userid = req.params.userId || req.query.userId
    if(!userid){
        return res.status(400).json({message : "id is required"})
    }

    try{
        const data = await userSchema.findById(userid).select("-password")
        return res.status(200).json({message : "ok" , 
            data:data
        })

    }catch(error){
        console.log(error)
    }

}

exports.update = async(req ,res) =>{
    const { name ,  password , address , city , state ,postalcode , email } =req.body

    if( !email ){
        return res.staus(400).json({message : "email is required"})
    }
try{

    const user = await userSchema.findOne({email})
    user.name = name || user.name
    user.password = password || user.password
    user.address.address = address || user.address.address
    user.address.city = city || user.address.city
    user.address.state = state || user.address.state
    user.address.postalcode = postalcode || user.address.postalcode

    await user.save()

    return res.status(200).json({message : "user updated" , data : user})
}catch(error){
    console.log(error)
    return res.status(400).json({message : "error" , error : error.message})
}
}

exports.deleteuser = async(req ,res) =>{
    const id = req.params.id || req.query.id 
    try{
        const user = await userSchema.findByIdAndDelete(id)
        if(!user){
            return res.status(404).json({message : "user not found"})
        }
        return res.status(200).json({message : "user deleted" , data : user})
    }catch(error){
        console.log(error)
        return res.status(400).json({message : "error" , error : error.message})
    }

}