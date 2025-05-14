const tranporter = require("../config/nodeMailer")
const otpstore = {}

exports.send_otp= async(req ,res)=>{

    const {email} = req.body

    if(!email){
        return res.status(401).json({message : "email is required"})
    }

    const otp = Math.floor(100000 + Math.random()*90000 );
    console.log(otp)
    otpstore[email] = otp
    try{
        const response =await tranporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:"Your Otp Code",
            text: `your otp is ${otp}`
        })

        setTimeout(() => {
            delete otpstore[email]
        }, [1000 * 5 *60]);

        return res.status(200).json({message : "otp send"})
    }catch(error){
        console.log(error)
        return res.status(400).json({message : error})
    }

}

exports.verify_otp = (req ,res)=>{
    const {email , otp} = req.body
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

    if(otpstore[email] === Number(otp) || otpstore[email] === otp){
        delete otpstore[email]
        return res.status(200).json({message : "ok" })
    }
    else{
        return res.status(400).json({message:"invalid otp"})
    }
}