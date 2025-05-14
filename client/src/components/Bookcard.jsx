import React from "react";
import { useToast } from "../Context/Toast";
import { addToCart } from "../api/Cart";

const Bookcard = ({ book }) => {
  const { showToast } = useToast();

  const addCart = async (book) => {
    const Userid = localStorage.getItem("userid");
    if (!Userid) {

      alert("Please log in to add items to your cart.");
      return;
    }

    const data ={
      bookid: book._id,
      Userid: localStorage.getItem("userid"),
      price: book.price,
      quantity: 1,
    }

    try {
      const response = await addToCart(data);
      console.log("Book added to cart:", response);
      showToast("Book added to cart successfully!", "success");
    } catch (error) {
      console.error("Error adding book to cart:", error);
    }
  };

  return (
    <div className="max-w-sm h-full rounded-lg overflow-hidden shadow-md bg-[#3a3a3a]/80 flex flex-col justify-between  hover:shadow-lg hover:shadow-yellow-400/20 transition duration-300">
      <img
        className="min-w-80 h-80 object-containr"
        src={book.coverimage.url}
        alt={`${book.title} cover`}
      />
      <div className="px-4 py-2 flex-grow flex  flex-col justify-between gap-1 hover:shadow-yellow-400/20 transition duration-300">
        <h3 className="font-bold text-lg text-white">{book.title}</h3>
        <p className="text-sm text-yellow-400">by {book.author}</p>
        <p className="text-sm  mt-1 line-clamp-3 text-white">{book.description}</p>
      </div>
      <div className="px-4 pb-3 flex self-end">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300"
          onClick={() => addCart(book)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Bookcard;