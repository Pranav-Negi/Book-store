import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { getBooks } from "../api/Bookapi";
import Bookcard from "../components/Bookcard";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader"

const Market = () => {
  const location = useLocation();
  const [book, setbook] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [spinner , setspinner] = useState(false)

  const [filter, setFlter] = useState({
    search: "",
    category: location?.state?.category || "",
    sort: "price",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProducts(filter, currentPage);
  }, [currentPage, filter]);

  const fetchProducts = async (data, page) => {
    setspinner(true)
    const response = await getBooks(data, page);
    setbook(response.data);
    setTotalPages(Math.ceil(response.total / 5));
    setspinner(false)
  };

  const handleprevious = () => {
    setspinner(true)
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  
  const handlenext = () => {
    setspinner(true)
    setCurrentPage((prev) => prev + 1);
    setspinner(false)
  };

  return (
    <>
    {spinner ? <Loader/> :""}
      <Navbar />
      <div className="flex flex-col h-full bg-gradient-to-r from-[#1e1e1e] to-[#2c2c2c]">
        {book.length === 0 ? (
          <div className="flex justify-center mt-20 h-screen">
            <h1 className="text-4xl font-bold text-yellow-400 mb-4 decoration-2 underline p-6">
              No Books Found for {filter.category}
            </h1>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-yellow-400 mb-4 decoration-2 underline p-6">
              Market Place
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 px-6">
              {book &&
                book.map((item) => {
                  return (
                    <div key={item._id} className="flex justify-center">
                      <Bookcard book={item} />
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-center gap-2 my-6">
              <button
                onClick={() => {
                  handleprevious();
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-yellow-400 text-black font-bold"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => {
                  handlenext();
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Market;