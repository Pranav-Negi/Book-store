const dotenv = require("dotenv")
dotenv.config()
const connecttion = require("./config/db")
connecttion()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors({
    origin: "http://localhost:5173", // or your frontend origin
    credentials: true
  }));
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const userRoutes = require("./routes/userRoutes")
const otpRoutes = require("./routes/otpRoutes")
const bookRoutes = require("./routes/bookRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const adminRoutes = require("./routes/adminRoutes")

app.use("/api/admin" , adminRoutes);
app.use("/api/user" , userRoutes);
app.use("/api/otp" , otpRoutes);
app.use("/api/books" , bookRoutes);
app.use("/api/cart" , cartRoutes)
app.use("/api/order" , orderRoutes)

app.listen(port , ()=>{
    console.log("server running on localhost:",port)
})