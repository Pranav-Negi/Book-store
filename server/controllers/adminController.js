const userSchema = require("../model/userSchema")
const bookSchema = require("../model/bookSchema")
const fs = require("fs");
const Cloudinary = require("../config/Cloudinary");


function sanitizeName(name) {
  return name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

exports.book = async(req , res)=>{
    const userid = req.params?.userid || req.query?.userid
    console.log(userid)

    if(!userid){
        res.status(400).json({message : "useride is required"})
    }
    try{
        const user =  await userSchema.findById(userid).select("-password").populate("books")
        res.status(200).json({message:"data" , data : user})
        
    }catch(error){
        console.log(error)
        res.status(400).json({message : "error", error:error.message})
    }
}

exports.upload = async (req, res) => {
  const userid = req.params.userid || req.query.userid;
  const { title, author, description, stock, price, category , discount} = req.body;

  if(!userid || !title  || !author || !description || !stock || !price || !category){
    return res.status(300).json({message : "all feild required"})
  } 

  const categoriesArray = Array.isArray(category)
    ? category
    : category
    ? [category]
    : [];
  console.log(categoriesArray);

  if (categoriesArray.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one category is required" });
  }

  try {
    if (!req.files || !req.files.image || !req.files.preview) {
      return res
        .status(400)
        .json({ message: "Cover image and preview images are required" });
    }

    // STEP 1: Create a basic Book entry to get its _id
    const newBook = await bookSchema.create({
      title,
      author,
      description,
      stock,
      price,
      discount,
      category: categoriesArray,
      uploadedby: userid,
    });

    // STEP 2: Now create folder name using title and _id
    const safeTitle = sanitizeName(title);
    const folderName = `${safeTitle}-${newBook._id.toString()}`;

    // STEP 3: Upload cover image
    const coverUpload = await Cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        folder: `Books/${folderName}`,
        public_id: `cover`,
      }
    );

    // STEP 4: Upload preview gallery images
    const galleryUpload = await Promise.all(
      req.files.preview.map((file, index) => {
        return Cloudinary.uploader.upload(file.path, {
          folder: `Books/${folderName}`,
          public_id: `preview${index + 1}`,
        });
      })
    );

    // STEP 5: Update Book entry with uploaded image URLs
    await bookSchema.findByIdAndUpdate(newBook._id, {
      coverimage: {
        public_id: coverUpload.public_id,
        url: coverUpload.secure_url,
      },
      gallery: galleryUpload.map((file) => ({
        public_id: file.public_id,
        url: file.secure_url,
      })),
    });
    await newBook.save();

    // STEP 6: Update User's books list
    await userSchema.findByIdAndUpdate(userid, {
      $push: { books: newBook._id },
    });

    // STEP 7: Clean up temp files
    fs.unlinkSync(req.files.image[0].path);
    req.files.preview.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    return res.status(201).json({
      message: "Book added successfully",
      url: coverUpload.secure_url,
      data: newBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updatebook = async (req, res) => {
  const bookid = req.params.bookid || req.query.bookid;
  const { author, description, stock, price, category } = req.body;
  try {
    if (!bookid) {
      return res.status(400).json({ message: "Book id required" });
    }

    const book = await bookSchema.findById(bookid);

    book.author = author || book.author;
    book.description = description || book.description;
    book.stock = stock || book.stock;
    book.price = price || book.price;

    const categoriesArray = Array.isArray(category)
      ? category
      : category
      ? [category]
      : [];
    book.category = categoriesArray;

    console.log(req.files.image);

    if (req.files.image) {
      await Cloudinary.uploader.destroy(book.coverimage.public_id);

      const uploadcover = await Cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `Books/${book.title.trim().replace(/\s+/g, "")}-${book._id}`,
          public_id: "cover",
        }
      );
      book.coverimage.public_id = uploadcover.public_id;
      book.coverimage.url = uploadcover.secure_url;

      fs.unlinkSync(req.files.image[0].path);
    }

    await book.save();

    return res
      .status(200)
      .json({ message: "Book updated successfully", data: book });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "error", error: error });
  }
};

exports.deletebook = async (req, res) => {
  const { bookid, userid } = req.query; // Or req.params based on your route

  if(!bookid || !userid){
    return res.status(300).json({message : "bookid and userid is required"})
  }

  try {
    const book = await bookSchema.findById(bookid);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const folderName = `Books/${book.title.trim().replace(/\s+/g, "")}-${
      book._id
    }`;

    console.log(folderName);

    // Delete cover image
    await Cloudinary.uploader.destroy(book.coverimage.public_id);

    // Delete Preview image
    await Promise.all(
      book.gallery.map((data) => {
        Cloudinary.uploader.destroy(data.public_id);
      })
    );

    // Delete folder from Cloudinary
    await Cloudinary.api.delete_folder(folderName);

    // Delete book from DB
    await bookSchema.findByIdAndDelete(bookid);

    // Remove book reference from user
    await userSchema.findByIdAndUpdate(userid, {
      $pull: { books: book._id },
    });

    return res
      .status(200)
      .json({ message: "Book and associated data deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting book", error });
  }
};

