const express = require("express")
const router = express.Router()
const {createorder ,getbyid  ,getmyorder ,updateOrderToPaid ,updateOrderTodelivered , cancelOrder} = require("../controllers/orderController")
const { protect} = require("../middleware/userMiddleware")

router.post("/createorder"  ,protect, createorder)
router.get("/getbyid"  ,protect, getbyid)
router.get("/getmyorder"  ,protect, getmyorder)
router.patch("/updateOrderToPaid"  ,protect, updateOrderToPaid)
router.patch("/updateOrderTodelivered"  ,protect, updateOrderTodelivered)
router.patch("/cancelOrder"  ,protect, cancelOrder)

module.exports = router