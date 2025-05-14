const express = require("express")
const router = express.Router()

const { register ,login, profile ,update , deleteuser } = require("../controllers/userControllers")
const { protect } = require("../middleware/userMiddleware")

router.post("/register" , register)
router.post("/login" , login)
router.get("/profile" ,protect ,profile)
router.patch("/update" ,protect ,update)
router.delete("/delete" ,protect ,deleteuser)



module.exports =router