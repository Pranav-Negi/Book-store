const express = require("express")
const router  = express.Router()
const { getAllbooks  ,getbyId ,addreview ,deletereview ,gettopratedbooks} = require("../controllers/bookController")
const { protect } = require("../middleware/userMiddleware")

router.get("/get", protect , getAllbooks)
router.get("/getone", protect , getbyId)
router.put("/addreview" , protect,addreview )
router.delete("/deletereview", protect , deletereview)
router.get("/gettopratedbooks", protect , gettopratedbooks)

module.exports = router