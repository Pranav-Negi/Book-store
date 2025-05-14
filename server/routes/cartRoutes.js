const express = require("express")
const router = express.Router()
const { protect } =require("../middleware/userMiddleware")
const { addtocart ,viewcart , deletefromcart ,deletewholecart }  = require("../controllers/cartController")


router.post("/addtocart" , protect,addtocart)
router.get("/viewcart" , protect ,viewcart)
router.delete("/deletefromcart" , protect ,deletefromcart)
router.delete("/deletewholecart" , protect ,deletewholecart)

module.exports = router