const express = require("express")
const { send_otp, verify_otp} = require("../controllers/otpControllers")
const router = express.Router()

router.post("/send_otp" , send_otp)
router.post("/verify_otp" , verify_otp)


module.exports =router