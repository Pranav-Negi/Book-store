const orderSchema = require("../model/orderSchema");
const bookSchema = require("../model/bookSchema");

exports.createorder = async (req, res) => {
  const userid = req.params.userid || req.query.userid;
  const {
    bookid,
    quantity,
    price,
    address,
    city,
    state,
    postalCode,
    paymentMethod,
  } = req.body;

  let totalPrice = 0;

  if (
    !bookid ||
    !quantity ||
    !price ||
    !address ||
    !city ||
    !state ||
    !postalCode ||
    !paymentMethod
  ) {
    return res
      .status(300)
      .json({
        message:
          "all state are required bookid , quantity , price , address , city , state , postalcode ,paymentMethod",
      });
  }

  if (paymentMethod === "Cash on delivery") {
    totalPrice = price + 60;
  }
  const book = await bookSchema.findById(bookid);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.stock < quantity) {
    return res
      .status(300)
      .json({ message: `only ${book.stock} are available` });
  }

  try {
    const order = await orderSchema.create({
      userid: userid,
      orderedItems: [
        {
          bookid: bookid,
          quantity: quantity,
          price: book.price,
        },
      ],
      shippingAddress: {
        address: address,
        city: city,
        state: state,
        postalCode: postalCode,
      },
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
    });

    book.stock -= quantity;
    await book.save();

    return res.status(200).json({ message: "order on the way", data: order });
  } catch (error) {
    return res.status(400).json({ message: "error", error: error.message });
  }
};

exports.getmyorder = async (req, res) => {
  const userid = req.query.userid || req.params.userid;

  if(!userid){
    return res.status(400).json({message : "userid required"})
  }
  
  try {
      const item = await orderSchema.find({
          userid,
        }).populate("orderedItems.bookid", "coverimage title author ratings");;
        return res.status(200).json({ message: "ok", data: item });
    } catch (error) {
        return res.status(300).json({ message: "errro", error: error.message });
    }
};

exports.getbyid = async (req, res) => {
    const id = req.params.id || req.query.id;
    if(!id){
      return res.status(400).json({message : "id required"})
    }
    
    try {
        const item = await orderSchema.findById(id);
        
        return res.status(200).json({ message: "ok", data: item });
    } catch (error) {
        return res.status(300).json({ message: "errro", error: error.message });
    }
};

exports.updateOrderToPaid = async (req, res) => { 
    
    const id =req.params.id || req.query.id
    if(!id){
      return res.status(400).json({message : "id required"})
    }
    const item = await orderSchema.findById(id)

    if(!item){
        return res.status(300).json({message : "item not found"})
    }

    item.isPaid =true
    
    await item.save()
    return res.status(200).json({message : "order is paid"})

 };

 exports.updateOrderTodelivered = async(req,res)=>{
        
    const id =req.params.id || req.query.id
    if(!id){
      return res.status(400).json({message : "id required"})
    }

    const item = await orderSchema.findById(id)

    if(!item){
        return res.status(300).json({message : "item not found"})
    }

    item.isDelivered = true
    item.orderStatus = "Delivered"
    
    await item.save()
    return res.status(200).json({message : "order is deleivered"})

 };

 exports.cancelOrder = async (req, res) => { 
   const id = req.params.id || req.query.id
   console.log(req.params)
    if(!id){
      return res.status(400).json({message : "id required"})
    }

    const item = await orderSchema.findById(id)

    if(!item){
        return res.status(300).json({message : "item not found"})
    }
    
    console.log(item.orderedItems)

    const bookid = item.orderedItems.map(item => item.bookid.toString())
    console.log(bookid)
    const book = await bookSchema.findById(bookid)

    if(!book){
        return res.status(300).json({message : "book not found"})
    }

    item.orderStatus = "Cancelled"
    
    book.stock +=1

    await item.save()
    await book.save()

    return res.status(200).json({message : "order cancelled"})

  };