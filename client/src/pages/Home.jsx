import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Bookcard from "../components/Bookcard";
import { getTopRatedBooks } from "../api/Bookapi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { addToCart } from "../api/Cart";
import { useToast } from "../Context/Toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"
import { useUser } from "../Context/UserContext";

const Home = () => {
  const [spinner , setspinner] = useState(false)
  const [books, setBooks] = useState([]);
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { userid } = useUser()

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); 
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getTopRatedBooks();
      console.log(response.data)
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handlecategory = (category) => {
    navigate(`/Market` , {state: {category: category}});
  }

  const handleaddtocart= async(book)=>{
        if (!userid) {
          alert("Please log in to add items to your cart.");
          return;
        }
    
        const data ={
          bookid: book._id,
          Userid:userid,
          price: book.price,
          quantity: 1,
          discount:book.discount
        }
    
        try {
          const response = await addToCart(data);
          console.log("Book added to cart:", response);
          showToast("Book added to cart successfully!", "success");
        } catch (error) {
          console.error("Error adding book to cart:", error);
        }
  }

  return (
    <>
      {spinner ? <Loader/> :""}
      <Navbar />
      <div className="w-full h-full px-6 py-4 bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white">
        <h2 className="text-3xl font-bold pb-4 underline decoration-[#fbbf24] decoration-4 underline-offset-4">
          Top Rated Books
        </h2>
    {/* Swiper for Top Rated Books */}
        <div className="relative w-full h-[75vh] rounded-xl shadow-xl bg-gradient-to-r from-[#3a3a3a] to-[#1f1f1f] p-6 flex items-center">
          {books.length > 0 ? (
            <>
              <Swiper
                spaceBetween={20}
                slidesPerView={3}
                navigation={false}
                modules={[Navigation]}
                className="w-full"
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}              
              >
                {books.map((book) => (
                  <SwiperSlide key={book._id}>
                    <Bookcard
                      book={book}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom positioned vertical Swiper controls */}
              <div className="absolute right-4 bottom-10 flex flex-col space-y-4 z-20">
                <button
                  text="Next"
                  onClick={() => swiperRef.current?.slideNext()}
                  className="!w-10 !h-10 !bg-[#2d2d2d]/80 hover:!bg-yellow-400 hover:!text-black !rounded-md !flex !items-center !justify-center !text-white shadow-lg transition duration-300"
                >
                  <FaChevronRight />
                </button>
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="!w-10 !h-10 !bg-[#2d2d2d]/80 hover:!bg-yellow-400 hover:!text-black !rounded-md !flex !items-center !justify-center !text-white shadow-lg transition duration-300"
                >
                  <FaChevronLeft />
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400">No books available.</p>
          )}
        </div>

        <div className="mt-16 px-6 py-8 bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] rounded-xl">
          {/* Featured Deals */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold pb-6 underline decoration-[#fbbf24] decoration-4 underline-offset-8">
              Today's Best Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {books
                .filter((book) => book.discount > 0)
                .slice(0, 3)
                .map((book) => (
                  <div
                    key={book._id}
                    className="bg-[#3a3a3a]/80 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-yellow-400/20 transition duration-300"
                  >
                    <div className="relative">
                      <img
                        src={book.coverimage.url}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                      />
                      { book.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {book.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                      <p className="text-yellow-400 mb-4">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {book.discount > 0 ? (
                            <>
                              <span className="text-gray-400 line-through mr-2">
                                ${book.price}
                              </span>
                              <span className="text-white font-bold">
                                $
                                {(
                                  book.price *
                                  (1 - book.discount / 100)
                                ).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-white font-bold">
                              ${book.price}
                            </span>
                          )}
                        </div>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300"
                          onClick={() => handleaddtocart(book)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Shopping Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[#3a3a3a]/50 p-6 rounded-xl flex items-start">
              <div className="text-yellow-400 mr-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
                <p className="text-gray-400">
                  256-bit SSL encryption for all transactions
                </p>
              </div>
            </div>

            <div className="bg-[#3a3a3a]/50 p-6 rounded-xl flex items-start">
              <div className="text-yellow-400 mr-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
                <p className="text-gray-400">
                  Dispatch within 24 hours, free on orders over $50
                </p>
              </div>
            </div>

            <div className="bg-[#3a3a3a]/50 p-6 rounded-xl flex items-start">
              <div className="text-yellow-400 mr-4">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
                <p className="text-gray-400">
                  30-day return policy, no questions asked
                </p>
              </div>
            </div>
          </div>

          {/* Best Authors */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold pb-6 underline decoration-[#fbbf24] decoration-4 underline-offset-8">
              Best Authors
            </h2>
            <Swiper
              spaceBetween={20}
              slidesPerView={4}
              navigation= {false}
              modules={[Navigation]}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {books
                .filter((book) => book.author)
                .map((book) => (
                  <SwiperSlide key={book._id}>
                    <div className="bg-[#3a3a3a]/80 p-4 rounded-lg hover:shadow-lg hover:shadow-yellow-400/20 transition duration-300">
                      <img
                        src={book.coverimage.url}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                      <h3 className="font-bold mb-1">{book.title}</h3>
                      <p className="text-yellow-400 text-sm mb-3">
                        {book.author}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">${book.price}</span>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm py-1 px-3 rounded transition duration-300  "
                          onClick={() => navigate("/order",{
                            state:{
                              book:book
                            }
                          })}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          {/* Category Preview */}
          <div>
            <h2 className="text-3xl font-bold pb-6 underline decoration-[#fbbf24] decoration-4 underline-offset-8">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Fiction",
                "Non-Fiction",
                "Children",
                "Science",
                "History",
                "Romance",
                "Fantasy",
                "Mystery",
              ].map((category) => (
                <a
                  key={category}
                  onClick={()=>{ handlecategory(category)}}
                  className="category-card bg-[#3a3a3a]/50 hover:bg-[#3a3a3a]/80 p-6 rounded-lg text-center transition duration-300 group"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/20 transition duration-300">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <h3 className="font-bold">{category}</h3>
                  <p className="text-gray-400 text-sm mt-1">Shop Now →</p>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 px-6 py-8 bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] rounded-xl">
          <h2 className="text-3xl font-bold pb-6 text-center underline decoration-[#fbbf24] decoration-4 underline-offset-8">
            About PageTurner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Mission Statement */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400 flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
                Our Mission
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We're revolutionizing book discovery by connecting readers with
                stories that matter. Our AI-powered platform learns your
                preferences to surface hidden gems beyond bestseller lists.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#3a3a3a]/80 p-4 rounded-lg text-center">
                <p className="text-yellow-400 text-3xl font-bold">10K+</p>
                <p className="text-gray-400">Books Cataloged</p>
              </div>
              <div className="bg-[#3a3a3a]/80 p-4 rounded-lg text-center">
                <p className="text-yellow-400 text-3xl font-bold">500+</p>
                <p className="text-gray-400">Publishers</p>
              </div>
              <div className="bg-[#3a3a3a]/80 p-4 rounded-lg text-center">
                <p className="text-yellow-400 text-3xl font-bold">24/7</p>
                <p className="text-gray-400">Recommendations</p>
              </div>
              <div className="bg-[#3a3a3a]/80 p-4 rounded-lg text-center">
                <p className="text-yellow-400 text-3xl font-bold">100%</p>
                <p className="text-gray-400">Reader Focused</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-center mb-8 text-yellow-400">
              Meet The Team
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Alex Morgan",
                  role: "Founder",
                  fact: "Reads 100 books/year",
                },
                {
                  name: "Sam Lee",
                  role: "CTO",
                  fact: "Builds book recommendation algorithms",
                },
                {
                  name: "Jordan Taylor",
                  role: "Editor",
                  fact: "Former librarian",
                },
                {
                  name: "Casey Smith",
                  role: "Community",
                  fact: "Hosts our book clubs",
                },
              ].map((person, index) => (
                <div
                  key={index}
                  className="bg-[#3a3a3a]/50 p-6 rounded-xl hover:bg-[#3a3a3a]/80 transition duration-300"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 text-2xl font-bold">
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h4 className="text-center font-bold">{person.name}</h4>
                  <p className="text-center text-yellow-400 text-sm mb-2">
                    {person.role}
                  </p>
                  <p className="text-center text-gray-400 text-xs">
                    {person.fact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Join Our Reading Community
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Get personalized recommendations, join virtual book clubs, and
              discover your next favorite read.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;