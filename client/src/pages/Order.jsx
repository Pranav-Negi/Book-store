import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import { addToOrder } from "../api/order";
import { useToast } from "../Context/Toast";
import Loader from "../components/Loader"
import { useUser } from "../Context/UserContext";

const Order = () => {
  const location = useLocation();
  const [book, setBook] = useState(location.state.book);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const { showToast } = useToast();
  const [spinner , setspinner] = useState(false)
  const {userid} = useUser()
  console.log(location.state.book);

  const [formData, setFormData] = useState({
    bookid:  book.bookid?._id ?  book.bookid?._id : book._id ,
    price: book.price,
    quantity: 1,
    address: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "",
  });

  console.log(formData.bookid)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Optional: Forcing numeric-only and max-length check for postalCode
    if (name === "postalCode" && !/^\d{0,6}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setspinner(true)
    console.log(formData);
    e.preventDefault();
    
    if (!userid) {
      alert("Please log in to place an order.");
      setspinner(false)
      return;
    }
    
    if (formData.paymentMethod === "Cash on delivery") {
      try {
        await addToOrder(userid, formData);
        console.log("Order submitted:", formData);
        showToast("Order placed successfully!", "success");
      } catch (error) {
        console.error("Error placing order:", error);
        showToast("Error placing order", "error");
      }finally{
        setspinner(false)
      }
    } else {
      showToast("Payment method not supported", "error");
      setspinner(false)
    }
  };
  const handlePreview = (preview) => {
    setPreviewData(preview);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    console.log("close preview");
    setShowPreview(false);
    setPreviewData([]);
  };

  return (
    <>
    {spinner ? <Loader/> :""}
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white px-6 py-5">
        <h1 className="text-3xl font-bold underline decoration-[#fbbf24] decoration-4 underline-offset-4 mb-5 mx-4">
          Confirm Your Order
        </h1>

        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg w-[90%] max-w-2xl">
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleClosePreview}
                  className="text-white text-xl hover:text-yellow-400"
                >
                  ✕
                </button>
              </div>
              <Slider preview={previewData} />
            </div>
          </div>
        )}

        <div className="flex flex-row justify-center gap-10">
          {/* Left - Book Info */}
          <div className="flex flex-col min-w-[25VW] bg-[#3a3a3a]/80 rounded-lg shadow-lg p-6 ">
            <div className="relative mb-6 self-center">
              <img
                src={
                  book.bookid?.coverimage?.url
                    ? book.bookid.coverimage.url
                    : book.coverimage?.url
                }
                className="h-[50vh]"
              />
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              {book.title || book.bookid.title}
            </h2>
            <p className="text-yellow-400 mb-2">
              {book.author || book.bookid.author}
            </p>
            <p className="text-gray-300 mb-4">
              {book.description || book.bookid.description}
            </p>
               {book.discount > 0 || book.bookid.discount > 0? 
                (
                      <>
                        <span className="text-gray-400 line-through mr-2">
                          ${book.price}
                        </span>
              
                          <span className="text-white font-bold">
                          ${(book.price * ((1 - book.discount / 100) || (1 - book.bookid.discount / 100)  )).toFixed(2)}
                        
                        </span>
                      </>
                    ) : (
                      <p className="text-white font-bold text-lg mb-4">
                        ${book.price.toFixed(2)}
                      </p>
                    )}
            <button
              onClick={() => handlePreview(book.gallery || book.bookid.gallery)}
              className="self-end cursor-pointer hover:text-yellow-400 transition duration-300"
            >
              View Preview
            </button>
          </div>

          {/* Right - Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:w-1/2 bg-[#3a3a3a]/80 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Shipping Address
            </h2>

            {["address", "city", "state", "postalCode"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 text-gray-300 capitalize">
                  {field}:
                </label>
                <input
                  type={field === "postalCode" ? "text" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:border-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ))}
            <div key="Payment Meathod" className="mb-4">
              <label className="block mb-1 text-gray-300 capitalize">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData["paymentMethod"]}
                onChange={handleChange}
                className="w-full p-2 rounded bg-[#2a2a2a] text-white border border-gray-600 focus:outline-none focus:border-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              >
                <option value=""></option>
                <option value="Cash on delivery">Cash on delivery</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Order;
