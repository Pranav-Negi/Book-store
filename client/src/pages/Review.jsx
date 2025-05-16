import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { getBookbyid, addReview ,deleteReview} from "../api/Bookapi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Loader from "../components/Loader";

const Review = () => {
  const userid = localStorage.getItem("userid");
  const location = useLocation();
  const [spinner, setspinner] = useState(false);
  const id = useRef(location.state.id);
  const [book, setbook] = useState([]);
  const [isreview, setisreview] = useState(false);
  const [review, setreview] = useState({
    rating: 1,
    comment: "",
  });
  const [myreview, setmyreview] = useState([]);
  const [othersreview, setothersreview] = useState([]);

  useEffect(() => {
    fetchbook(id.current);
  }, []);

  useEffect(() => {
    if (book.reviews && userid) {
      const mine = book.reviews.filter((item) => item.Userid._id === userid);
      const others = book.reviews.filter((item) => item.Userid._id !== userid);
      setmyreview(mine);
      setothersreview(others);
    }
  }, [book]);

  const fetchbook = async (bookid) => {
    try {
      setspinner(true)
      const response = await getBookbyid(bookid);
      console.log(response.data);
      setbook(response.data);
    } catch (error) {
      console.log(error);
    }finally{
      setspinner(false)
    }
  };

  const handlechange = (e) => {
    const { value, name } = e.target;

    setreview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async () => {
    setspinner(true)
    if (!userid) {
      alert("please login");
      return;
    }
    try{
      await addReview(id.current, userid, review);
      setreview({
        rating: 1,
        comment: "",
      });
      handlereview();     
      await fetchbook(id.current);
    }catch(error){
      console.log(error)
    }finally{
      setspinner(false)
    }
  };

  const handlereview = () => {
    setisreview(!isreview);
  };

  const handledelete = async (reviewid) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;
    try{
      const response = await deleteReview(id.current, reviewid);
      console.log(response)
      await fetchbook(id.current);
    }catch(error){
      console.log(error)
    }finally{
      setspinner(false)
    }
  };

  return (
    <>
      {spinner && <Loader />}
      {isreview ? (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center gap-2">
          <div className="bg-[#2f2f2f] p-6 rounded-xl w-full max-w-md shadow-lg flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="Comment"
                className="block font-medium text-white capitalize text-2xl"
              >
                Comment
              </label>
              <input
                type="text"
                name="comment"
                id="comment"
                value={review.comment}
                onChange={handlechange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm  p-2 focus:outline-none
              caret-white text-white"
                required
              />
            </div>
            <div className="flex gap-2 mb-5">
              <h1 className="text-white">Rate this Book :</h1>
              {[...Array(5)].map((_, starIndex) => (
                <svg
                  key={starIndex}
                  className={`w-5 h-5 cursor-pointer ${
                    starIndex < review.rating
                      ? "text-yellow-400"
                      : "text-gray-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  onClick={() =>
                    setreview((prev) => ({
                      ...prev,
                      rating: starIndex + 1,
                    }))
                  }
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.98 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967" />
                </svg>
              ))}
            </div>
            <div className="w-full flex gap-2 ">
              <button
                onClick={handlereview}
                className="w-full text-white bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlesubmit}
                className="w-full text-white bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md"
                disabled={!review.comment}
              >
                Submit
              </button>
            </div>
            {/* Add your review form here */}
          </div>
        </div>
      ) : (
        ""
      )}
      <Navbar />
      <div className="h-[92vh] w-full bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white flex flex-col">
        {/* Header */}
        <h1 className="text-3xl font-bold underline decoration-yellow-400 decoration-4 underline-offset-4 mb-4 px-6 pt-5">
          Review
        </h1>

        {/* Content Section (Book & Review) */}
        <div className="flex flex-1 overflow-hidden px-5 h-max-fit mb-10">
          {/* Left - Static Book Section */}
          <div className="lg:w-1/2 w-full h p-6 space-y-4 bg-[#2f2f2f] border-r border-gray-700 rounded-tl-2xl rounded-bl-2xl overflow-hidden">
            <h3 className="text-2xl font-bold text-yellow-400">{book.title}</h3>
            <div className="flex items-center gap-10">
              <img
                src={book.coverimage?.url}
                alt="Book Cover"
                className="min-w-60 h-96 object-cover rounded-md shadow self-start"
              />
              <div className="space-y-2 self-start">
                <p className="text-lg font-medium text-yellow-300">
                  {book.author}
                </p>
                <p>
                  <span className="text-gray-400">Quantity:</span>{" "}
                  {book.quantity}
                </p>
                <p>
                  <span className="text-gray-400">Price:</span> ${book.price}
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

          {/* Right - Scrollable Reviews */}
          <div className="lg:w-1/2 w-full overflow-y-auto  bg-[#2b2b2b]">
            {book.reviews === undefined || book.reviews.length === 0 ? (
              <div className="text-center space-y-4 mt-5">
                <h1 className="text-2xl">No review Yet</h1>
                <button
                  className="text-yellow-400 hover:text-yellow-500 cursor-pointer"
                  onClick={() => {
                    handlereview();
                  }}
                >
                  Add review?
                </button>
              </div>
            ) : (
              <div className="space-y-6 m-2 ">
                <div className="flex justify-between items-center bg-[#232222] w-full h-10 px-4 py-2 sticky top-0  rounded-2xl">
                  <p>
                    <span className="text-gray-400">Total Reviews:</span>{" "}
                    {book.numReviews}
                  </p>

                  <p
                    className="text-yellow-400 hover:text-yellow-500 cursor-pointer "
                    onClick={() => {
                      handlereview();
                    }}
                  >
                    Add review?
                  </p>
                </div>
                <div className="m-6">
                  {/*My review */}
                  {myreview &&
                    myreview.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-700 pb-4 flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-center mt-2">
                          <p>
                            <span className="text-white">By - </span>{" "}
                            {item.Userid.name}
                          </p>
                          <button
                            className="text-2xl cursor-pointer"
                            onClick={() => {
                              handledelete(item._id);
                            }}
                          >
                            <MdOutlineDeleteOutline />
                          </button>
                        </div>
                        <p className="text-gray-400">{item.comment}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, starIndex) => (
                            <svg
                              key={starIndex}
                              className={`w-5 h-5 ${
                                starIndex < item.rating
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
                    ))}

                  {/*others review */}
                  {othersreview &&
                    othersreview.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-700 pb-4"
                      >
                        <p>
                          <span className="text-white">By - </span>{" "}
                          {item.Userid.name}
                        </p>
                        <p className="text-gray-400">{item.comment}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, starIndex) => (
                            <svg
                              key={starIndex}
                              className={`w-5 h-5 ${
                                starIndex < item.rating
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
                    ))}
                  <p
                    className="text-yellow-400 hover:text-yellow-500 cursor-pointer text-center p-2"
                    onClick={() => {
                      handlereview();
                    }}
                  >
                    Add review?
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
