import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProfile, deleteProfile } from "../api/Userapi";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useUser } from "../Context/UserContext";

const Profile = () => {
  const { userid} = useUser()
  const [user, setUser] = useState({});
  const [spinner, setspinner] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setspinner(true);
    if (!userid) {
      alert("Please log in to view your profile.");
      setspinner(false);
      return;
    }

    try {
      const response = await getProfile(userid);
      setUser(response.data);
      setspinner(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setspinner(false);
    }
  };

  const handledeleteProfile = async (id) => {
    setspinner(true);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if(!confirmDelete){
      setspinner(false)
      return;
    }
    if (confirmDelete) {
      try {
        const response = await deleteProfile(id);
        alert("Profile deleted successfully");
        localStorage.removeItem("token");
        navigate("/");
        setspinner(false);
      } catch (error) {
        console.error("Error deleting profile:", error);
        setspinner(false);
      }
    }
  };

  const handleviewbook = (id) => {
    navigate("/Books");
  };

  return (
    <>
      {spinner ? <Loader /> : ""}
      <Navbar />
      <div className="h-[92vh] bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] text-white flex justify-center">
        <div className="w-[60vw] h-fit bg-gradient-to-r from-[#201f1f] to-[#1a1a1a]  rounded-2xl shadow-lg p-8 mt-9">
          {/* Header */}
          <h1 className="text-4xl font-bold mb-8 border-b border-gray-700 pb-4 text-center">
            My Profile
          </h1>

          {/* User Info */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 mb-8 flex gap-4 text-lg justify-around">
            <div className="flex flex-col gap-5">
              <p>
                <span className="font-semibold text-gray-300">Name:</span>{" "}
                {user.name}
              </p>
              <p>
                <span className="font-semibold text-gray-300">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-semibold text-gray-300">Phone:</span>{" "}
                {user.phoneno}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <p>
                <span className="font-semibold text-gray-300">Address:</span>{" "}
                {user.address?.address}
              </p>
              <p>
                <span className="font-semibold text-gray-300">City:</span>{" "}
                {user.address?.city}
              </p>
              <p>
                <span className="font-semibold text-gray-300">State:</span>{" "}
                {user.address?.state}
              </p>
              <p>
                <span className="font-semibold text-gray-300">Postalcode:</span>{" "}
                {user.address?.postalcode}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Link
              to="/History"
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl text-center font-semibold shadow-md transition duration-200"
            >
              Order History
            </Link>
            <Link
              to="/cart"
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl text-center font-semibold shadow-md transition duration-200"
            >
              View Cart
            </Link>
            <Link
              to="/Update"
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl text-center font-semibold shadow-md transition duration-200"
            >
              Edit Profile
            </Link>
            <button
              onClick={() => {
                handledeleteProfile(user._id);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl text-center font-semibold shadow-md transition duration-200"
            >
              Delete Profile
            </button>
            {user.role === "admin" ? (
              <button
                onClick={() => {
                  handleviewbook();
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl text-center font-semibold shadow-md transition duration-200"
              >
                View Books
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
