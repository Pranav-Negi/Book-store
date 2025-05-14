const cartSchema = require("../model/cartSchema");
const mongoose = require('mongoose');
const User = require("../model/userSchema");

exports.addtocart = async (req, res) => {
  const { Userid, bookid, price, quantity , discount} = req.body;

  if(!User  || !bookid || !price || !quantity){
    return res.status(404).json({ message: "Userid,bookid,,price and quantity is required" });
  }


  try {
    const cart = await cartSchema.findOne({ Userid });
    // console.log(cart);
    if (cart) {
      cart.items.push({
        bookid,
        price,
        quantity,
        discount
      });

      await cart.save();
      return res.status(200).json({ message: "Added to cart" });
    } else {
      const newcart = await cartSchema.create({
        Userid: Userid, // Corrected to match the destructured value
        items: [
          {
            bookid,
            price,
            quantity,
          },
        ],
      });
      return res.status(200).json({ message: "Added to cart", cart: newcart });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error", error: error });
  }
};

exports.viewcart = async (req, res) => {
  const Userid = req.query.Userid || req.params.Userid;

  if (!Userid) {
    return res.status(404).json({ message: "Userid is required" });
  }

  try {
    // Find cart and count items in parallel for better performance
    const [cart] = await Promise.all([
      cartSchema
        .findOne({ Userid })
        .populate("items.bookid" ,"coverimage title author description price category ratings gallery") // Only populate necessary fields
        .lean(),
         // Convert to plain JS object for better performance
      cartSchema.countDocuments({ Userid }),
    ]);

    if (cart) {
      return res
        .status(200)
        .json({ message: "Cart fetched successfully", data: cart });
    } else {
      return res
        .status(200)
        .json({ message: "Cart is empty", data: "Cart is empty" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error", error: error });
  }
};

exports.deletefromcart = async(req ,res) =>{
  const bookid   = req.query.id || req.params.id
  const Userid  = req.query.Userid || req.params.Userid
  console.log(Userid)

  if(!User){
    return res.status(404).json({ message: "Userid is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(bookid) || !mongoose.Types.ObjectId.isValid(Userid)) {
    return res.status(400).json({ message: "Invalid ID(s)" });
  }

  try{

    const cart = await cartSchema.findOne(
      {Userid : Userid}
    );
    console.log(cart)
    cart.items.pull({bookid : bookid})
    await cart.save()
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({message : "ok" ,cart :cart})

  }catch(error){
    return res.status(400).json({message : "not ok" ,error : error})
  }
}

exports.deletewholecart = async (req, res) => {
  const Userid = req.params.Userid || req.query.Userid;

  if(!User){
    return res.status(404).json({ message: "Userid is required" });
  }

  try {
    const cart = await cartSchema.findOneAndDelete({ Userid });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log(cart);
    return res.status(200).json({ message: "Cart deleted successfully", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};