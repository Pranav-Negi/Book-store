import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getbook } from "../api/Admin";

const Books = () => {
  const userid = localStorage.getItem("userid");
  const [spinner, setspinner] = useState(false);
  const [books, setbook] = useState([]);
  const [user, setuser] = useState([]);

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
      setuser(response.data);
      setbook(response.data.books);
      console.log(response);
      console.log(response.data.books.price)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {spinner && <Loader />}
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white px-6 py-5">
        <h1 className="text-3xl font-bold underline decoration-yellow-400 decoration-4 underline-offset-4 mb-6 mx-4">
          Your Books
        </h1>
        {books?.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No order yet</p>
        ) : (
          <div className="space-y-8">
            {books.map((books, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row bg-[#2f2f2f] hover:bg-[#3a3a3a] transition-all duration-300 rounded-xl shadow-xl overflow-hidden"
              >
                {/* Left Section - Book Details */}
                <div className="lg:w-1/2 p-6 space-y-4">
                  <h3 className="text-2xl font-bold text-yellow-400">
                    {books.title}
                  </h3>
                  <div className="flex items-center gap-6">
                    <img
                      src={books.coverimage?.url}
                      alt="Book Cover"
                      className="w-32 h-48 object-cover rounded-md shadow"
                    />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-yellow-300">
                        {books.author}
                      </p>
                      <p>
                        <span className="text-gray-400">Quantity:</span>{" "}
                        {books.quantity}
                      </p>
                      <p>
                        <span className="text-gray-400">Price:</span> ${books.price}
                      </p>
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">Ratings:</span>
                        {[...Array(5)].map((_, starIndex) => (
                          <svg
                            key={starIndex}
                            className={`w-5 h-5 ${
                              starIndex < books.ratings
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

                {/* Right Section - Order Info */}
                <div className="lg:w-1/2 p-6 border-t lg:border-l lg:border-t-0 border-gray-700 space-y-4">
                  <p>
                    <span className="text-gray-400">Discount:</span> {books.discount}%
                  </p>
                  <p>
                    <span className="text-gray-400">Total Reviews:</span> {books.numReviews}
                  </p>
                  <p>
                    <span className="text-gray-400">Total Stock:</span> {books.stock}
                  </p>
                  <p>
                    <span className="text-gray-400">Uploaded At:</span>{" "}
                    {new Date(books.createdAt).toISOString().slice(0, 10)}
                  </p>
                  <p>
                    <span className="text-gray-400">Total:</span> $
                    {(Number(books.price) * Number(books.quantity)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Books;
