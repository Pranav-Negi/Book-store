import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getbook } from "../api/Admin";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const Books = () => {
  const { userid } = useUser()
  const [spinner, setspinner] = useState(false);
  const [books, setbook] = useState([]);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menu = useRef();

  useEffect(() => {
    fetchbook(userid);
  }, []);

  const fetchbook = async (userid) => {
    if (!userid) {
      alert("please login");
      return;
    }
    try {
      const response = await getbook(userid);
      setbook(response.data.books);
    } catch (error) {
      console.log(error);
    }
  };

  const handleupload = () => {
    navigate("/Upload");
  };

  const handelupdate = (book) => {
    console.log(book);
  };

  const handlereview = (id) => {
    navigate("/review", {
      state: {
        id: id,
      },
    });
  };

  return (
    <>
      {spinner && <Loader />}
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white px-6 py-5 ">
        <div className="flex justify-between py-2">
          <h1 className="text-3xl font-bold underline decoration-yellow-400 decoration-4 underline-offset-4 mb-6 mx-4">
            Your Books
          </h1>
          <button
            className="cursor-pointer px-5 text-black font-bold  bg-yellow-400 hover:bg-yellow-500 rounded-2xl transition duration-300"
            onClick={handleupload}
          >
            Add book?
          </button>
        </div>
        {books?.length === 0 ? (
          <div className="flex justify-center gap-2 items-center">
            <p className=" text-gray-400 text-2xl">No book yet </p>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {books.map((book, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row bg-[#2f2f2f] hover:bg-[#3a3a3a] transition-all duration-300 rounded-xl shadow-xl overflow-hidden relative"
                  >
                    {/* Three-dot menu button */}
                    <div className="absolute right-4 top-4 z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(!showMenu);
                          menu.current = index;
                        }}
                        className="text-gray-400 hover:text-white p-2 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01"
                          />
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {showMenu && index === menu.current && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#3a3a3a] rounded-md shadow-lg z-10 border border-gray-700">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                handelupdate(book);
                                setShowMenu(false);
                                // navigate(`/update-book/${book._id}`);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#4a4a4a] hover:text-white"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => {
                                handlereview(book._id);
                                setShowMenu(false);
                                // navigate(`/reviews/${book._id}`);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#4a4a4a] hover:text-white"
                            >
                              Reviews
                            </button>
                            <button
                              onClick={() => {
                                // Handle Delete
                                setShowMenu(false);
                                // handleDelete(book._id);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#4a4a4a] hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Left Section - Book Details */}
                    <div className="lg:w-1/2 p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-yellow-400">
                        {book.title}
                      </h3>
                      <div className="flex items-center gap-6">
                        <img
                          src={book.coverimage?.url}
                          alt="Book Cover"
                          className="w-32 h-48 object-cover rounded-md shadow"
                        />
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-yellow-300">
                            {book.author}
                          </p>
                          <p>
                            <span className="text-gray-400">Quantity:</span>{" "}
                            {book.quantity}
                          </p>
                          <p>
                            <span className="text-gray-400">Price:</span> $
                            {book.price}
                          </p>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">Ratings:</span>
                            {[...Array(5)].map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                className={`w-5 h-5 ${
                                  starIndex < book.ratings
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
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Book Info */}
                    <div className="lg:w-1/2 p-6 border-t lg:border-l lg:border-t-0 border-gray-700 space-y-4">
                      <p>
                        <span className="text-gray-400">Discount:</span>{" "}
                        {book.discount}%
                      </p>
                      <p>
                        <span className="text-gray-400">Total Reviews:</span>{" "}
                        {book.numReviews}
                      </p>
                      <p>
                        <span className="text-gray-400">Total Stock:</span>{" "}
                        {book.stock}
                      </p>
                      <p>
                        <span className="text-gray-400">Uploaded At:</span>{" "}
                        {new Date(book.createdAt).toISOString().slice(0, 10)}
                      </p>
                      <p>
                        <span className="text-gray-400">Total:</span> $
                        {(Number(book.price) * Number(book.quantity)).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Books;
