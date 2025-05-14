const express = require("express")
const router = express.Router()

const { book,upload ,updatebook ,deletebook } = require("../controllers/adminController")
const { isadmin } = require("../middleware/isadminMiddelware")
const { protect } = require("../middleware/userMiddleware")
const {uploadMiddleware } =require("../middleware/uploadMiddelware")

router.get("/books" ,protect,isadmin, book)
router.post("/upload" ,protect,isadmin,uploadMiddleware, upload)
router.patch("/update" ,protect,isadmin, updatebook)
router.delete("/deletebook" ,protect,isadmin, deletebook)


module.exports = router