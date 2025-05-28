import { useState, useEffect } from "react";
import { getmyorder ,cancelOrder } from "../api/order";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader"
import { useUser } from "../Context/UserContext";

const History = () => {
  const { userid } = useUser()
  const [orders, setOrders] = useState([]);
  const [spinner , setspinner] = useState(false)
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setspinner(true)
    try {
      const response = await getmyorder(userid);
      setOrders(response.data);
      setspinner(false)
    } catch (error) {
      console.log(error);
      setspinner(false)
    }
  };

  const handlecancel = async(id)=>{
    const confirm = window.confirm("Are you sure want to cancel the order")
    if(confirm){
      try{
        const response = await cancelOrder(id)
        getOrders()
      }catch(error){
        console.log(error)
      }
    }
  }

  return (
    <>
      {spinner ? <Loader/> :""}
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white px-6 py-5">
        <h1 className="text-3xl font-bold underline decoration-yellow-400 decoration-4 underline-offset-4 mb-5 mx-4">
          Order History
        </h1>
    {orders && orders.length === 0 ? (
          <p className="text-center text-gray-400">No order yet</p>
    ): (
      <div className="space-y-8">
          {orders.map((order, index) => (
            <div
            key={index}
            className="flex flex-col lg:flex-row bg-[#3a3a3a]/80 rounded-lg shadow-lg overflow-hidden"
            >
              {/* Left Section - Book Details */}
              <div className="lg:w-1/2 p-6">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-400">
                  Books Ordered
                </h3>
                <div className="space-y-4">
                  {order.orderedItems.map((item, idx) => (
                    <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-6 p-4 border border-gray-600 rounded-md"
                    >
                      <img
                        src={item.bookid.coverimage?.url}
                        alt={item.bookid.title}
                        className="w-32 h-48 object-cover rounded self-center"
                        />
                      <div className="flex flex-col justify-between">
                        <div>
                          <h4 className="text-xl font-semibold mb-1">
                            {item.bookid.title}
                          </h4>
                          <p className="text-yellow-400 mb-2">
                            {item.bookid.author}
                          </p>
                          <p className="text-gray-300 mb-1">
                            <span className="text-white">Quantity:</span> {item.quantity}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-white">Price:</span> ${item.price}
                          </p>
                        </div>
                        <div className="flex items-center mt-3">
                          <span className="text-yellow-400 mr-2">Ratings:</span>
                          {[...Array(5)].map((_, starIndex) => (
                            <svg
                            key={starIndex}
                            className={`w-5 h-5 ${
                              starIndex < item.bookid.ratings
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
                  ))}
                </div>
                {
                  order.orderStatus === "Cancelled" || order.orderStatus ==="deleiverd" ?null:
                  (
                    <button  
                    className="text-[1rem] bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300 my-2"
                    onClick={()=>{handlecancel(order._id)}}>Cancel Order</button>
                  )
                  }
              </div>

              {/* Right Section - Order Info */}
              <div className="lg:w-1/2 p-6 border-t lg:border-l lg:border-t-0 border-gray-600">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-400">
                  Order Information
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-300">
                    <span className="text-white">Status:</span>{" "}
                    <span
                      className={`${
                        order.orderStatus === "Delivered"
                        ? "text-green-400"
                        : order.orderStatus === "Cancelled"
                        ? "text-red-400"
                        : "text-yellow-400"
                      }`}
                      >
                      {order.orderStatus}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white">Payment:</span>{" "}
                    <span className={order.isPaid ? "text-green-400" : "text-red-400"}>
                      {order.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white">Delivered:</span>{" "}
                    <span className={order.isDelivered ? "text-green-400" : "text-red-400"}>
                      {order.isDelivered ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white">Payment Method:</span> {order.paymentMethod}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white">Total:</span> ${order.totalPrice}
                  </p>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                      Shipping Address
                    </h4>
                    <p className="text-gray-300">{order.shippingAddress.address}</p>
                    <p className="text-gray-300">
                      {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
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

export default History;