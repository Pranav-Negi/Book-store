const bookSchema = require("../model/bookSchema");

// Helper function to sanitize folder name
function sanitizeName(name) {
  return name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

exports.getAllbooks = async (req, res) => {
  const { page = 1, limit = 10, search = "", category = "" } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    const categoryArray = category.split(",").map((c) => c.trim());
    query.category = {
      $in: categoryArray.map((c) => new RegExp(`^${c}$`, "i")),
    };
  }
  try {
    const book = await bookSchema
      .find(query)
      .select("-gallery")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await bookSchema.countDocuments(query);

    return res.status(200).json({
      message: "ok",
      total: total,
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

exports.getbyId = async (req, res) => {
  const bookid = req.params.bookid || req.query.bookid;

  if (!bookid) {
    return res.status(400).json({ message: "id required for book" });
  }
  try {
    const response = await bookSchema
      .findById(bookid)
      .select("-createdAt -stock -updatedAt")
      .populate({
        path: "reviews",
        populate: {
          path: "Userid",
          select: "name",
        },
      });
    return res.status(200).json({ message: "OK", data: response });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.addreview = async (req, res) => {
  const bookid = req.params.bookid || req.query.bookid;
  const Userid = req.params.Userid || req.query.Userid;
  const { rating, comment } = req.body;

  if (!Userid || !rating) {
    return res.status(400).json({ message: "userId or rating is required" });
  }

  try {
    const book = await bookSchema.findById(bookid);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.reviews.push({ Userid: Userid, rating, comment });

    book.numReviews = book.reviews.length;

    const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
    book.ratings = totalRating / book.numReviews;

    await book.save();

    return res.status(200).json({ message: "comment added" });
  } catch (error) {
    console.log(error);
    return res.status(301).json({ message: "error", error: error });
  }
};

exports.deletereview = async (req, res) => {
  try {
    const bookid = req.params.bookid || req.query.bookid;
    const reviewid = req.params.reviewid || req.query.reviewid;

    if (!bookid || !reviewid) {
      return res
        .status(400)
        .json({ message: "bookid and review id is required" });
    }

    const book = await bookSchema.findById(bookid);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Filter out the review to delete
    book.reviews = book.reviews.filter((r) => r._id.toString() !== reviewid);

    // Update number of reviews
    book.numReviews = book.reviews.length;

    // Recalculate average rating
    const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
    book.ratings = book.numReviews > 0 ? totalRating / book.numReviews : 0;

    await book.save();

    res.status(200).json({ message: "Review deleted", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review", error });
  }
};

exports.gettopratedbooks = async (req, res) => {
  const { search = "", category = "" } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    const categoryArray = category.split(",").map((c) => c.trim());
    query.category = { $in: categoryArray };
  }

  try {
    const book = await bookSchema.find(query).sort({ rating: -1 }).limit(10);

    const total = await bookSchema.countDocuments(query);
    return res.status(200).json({
      message: "ok",
      total: total,
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(300).json({ message: "error", error: error });
  }
};
