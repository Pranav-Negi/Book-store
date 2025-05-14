import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "../api/Cart";
import Navbar from "../components/Navbar";
import { useToast } from "../Context/Toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [spinner , setspinner] = useState(false)
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setspinner(true)
    const UserId = localStorage.getItem("userid");
    if (!UserId) {
      alert("Please log in to view your cart.");
      return;
    }

    try {
      const response = await getCart(UserId);
      console.log("Cart items:", response.data.items);
      setCartItems(response.data.items); // Assuming `items` is the array of books in the cart
      setspinner(false)
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setspinner(false)
    }
  };

  const handleRemoveFromCart = async (bookid) => {
    setspinner(true)
    const UserId = localStorage.getItem("userid");
    if (!UserId) {
      alert("Please log in to remove items from your cart.");
      return;
      setspinner(false)
    }
    
    try {
      await removeFromCart(bookid, UserId);
      console.log("Book removed from cart:", bookid);
      showToast("Book removed from cart successfully!", "success");
      fetchCartItems(); // Refresh the cart items after removal
      setspinner(false)
    } catch (error) {
      console.error("Error removing book from cart:", error);
      showToast("Error removing book from cart", "error");
      setspinner(false)
    }
  };

  const handleclearCart = async () => {
    setspinner(true)
    const Userid = localStorage.getItem("userid");
    if (!Userid) {
      alert("Please log in to clear your cart.");
      setspinner(false)
      return;
    }
    try {
      await clearCart(Userid);
      showToast("Cart cleared successfully!", "success");
      fetchCartItems(); // Refresh the cart items after clearing
      setspinner(false)
    } catch (error) {
      console.error("Error clearing cart:", error);
      showToast("Error clearing cart", "error");
      setspinner(false)
    }
  };

  const handleorder = (book) => {
    navigate("/Order", {
      state: { book: book },
    });
  };
  return (
    <>
    {spinner ? <Loader/> :""}
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white px-6 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold underline decoration-[#fbbf24] decoration-4 underline-offset-4 mb-8">
            Your Shopping Cart
          </h1>
          {cartItems && cartItems.length > 0 ? (
            <button
              className="mb-8 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300"
              onClick={() => {
                handleclearCart();
              }}
            >
              Clear Cart
            </button>
          ) : null}
        </div>
        {cartItems && cartItems.length === 0 ? (
          <p className="text-center text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cartItems &&
              cartItems.map((item) => (
                <div
                  key={item.bookid._id}
                  className="bg-[#3a3a3a]/80 rounded-lg shadow-lg overflow-hidden hover:shadow-yellow-400/20 transition duration-300"
                >
                  <img
                    src={item.bookid.coverimage.url}
                    alt={item.bookid.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">
                      {item.bookid.title}
                    </h2>
                    <p className="text-yellow-400 text-sm mb-2">
                      {item.bookid.author}
                    </p>
                    <p className="text-gray-300 text-sm mb-4">
                      {item.bookid.description}
                    </p>
                    <p className="text-gray-400 text-sm mb-2">
                      <strong>Category:</strong>{" "}
                      {item.bookid.category.map((item) => {
                        return (
                          <span key={item} className="text-yellow-400 px-1">
                            {item}
                          </span>
                        );
                      })}
                    </p>

                    {item.bookid.discount > 0 ? (
                      <>
                        <span className="text-gray-400 line-through mr-2">
                          ${item.price}
                        </span>
                        <span className="text-white font-bold">
                          ${(item.price * (1 - item.bookid.discount / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <p className="text-white font-bold text-lg mb-4">
                        ${item.bookid.price.toFixed(2)}
                      </p>
                    )}
                    <div className="flex items-center mb-4">
                      <span className="text-yellow-400 mr-2">Ratings:</span>
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            index < item.bookid.ratings
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.98 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <button
                        className="w-30% bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300"
                        onClick={() => handleorder(item)}
                      >
                        Buy Now
                      </button>

                      <button
                        className="w-[50%] bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300"
                        onClick={() => handleRemoveFromCart(item.bookid._id)}
                      >
                        Remove from Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
