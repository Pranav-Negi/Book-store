import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/Toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import Otp from "../components/Otp";
import { sendOtp, verifyOtp } from "../api/Otp";
import { getProfile, updateProfile } from "../api/Userapi";
import Loader from "../components/Loader";

const Update = () => {
  const navigate = useNavigate();
  const [otpsent, setOtpsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [spinner , setspinner] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    city: "",
    state: "",
    postalcode: "",
    phoneno: "",
    role: "user",
  });
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    handleuser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const back = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    setspinner(true)
    e.preventDefault();
    await sendOtp(formData.email);
    setOtpsent(true);
    showToast("OTP sent to your email", "success");
    setspinner(false)
  };
  
  const onsubmit = async (otp) => {
    setspinner(true)
    if (otp.length !== 6 || otp.includes(" ")) {
      return showToast("Please enter a valid 6-digit OTP", "error");
    }
    try {
      await verifyOtp(formData.email, otp);
      await updateProfile(formData);
      showToast("Profile updated successfully", "success");
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        city: "",
        state: "",
        postalcode: "",
        phoneno: "",
        role: "user",
      });
      setOtpsent(false);
      navigate("/profile");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }finally{
      setspinner(false)
    }
  };

  const handleclose = () => {
    setOtpsent(false);
  };

  const handleuser = async () => {
    setspinner(true)
    const userId = localStorage.getItem("userid");
    if (!userId) {
      alert("Please log in to view your profile.");
      return;
    }

    try {
      const response = await getProfile(userId);
      console.log(response);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        password: response.data.password,
        address: response.data.address.address,
        city: response.data.address.city,
        state: response.data.address.state,
        postalcode: response.data.address.postalcode,
        phoneno: response.data.phoneno,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }finally{
      setspinner(false)
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {spinner ? <Loader/> : ""}
      <div className="w-full max-w-3xl bg-[#3a3a3a]/80 rounded-lg p-6 shadow-lg text-white">
        {otpsent ? (
          <Otp
            close={handleclose}
            email={formData.email}
            back={back}
            submit={onsubmit}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              Update Profile
            </h2>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* Left Column */}
              <div className="space-y-4">
                {["name", "email", "phoneno"].map((item) => (
                  <div key={item}>
                    <label
                      htmlFor={item}
                      className="block text-sm font-medium text-white capitalize"
                    >
                      {item}
                    </label>
                    <input
                      type={
                        item === "email"
                          ? "email"
                          : item === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : "text"
                      }
                      name={item}
                      id={item}
                      value={formData[item]}
                      disabled={item === "email"}
                      onChange={handleChange}
                      minLength={
                        item === "phoneno"
                          ? 10
                          : item === "password"
                          ? 8
                          : undefined
                      }
                      maxLength={item === "phoneno" ? 10 : undefined}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm  p-2 focus:outline-none
                  caret-white"
                    />
                    {item === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="relative left-80 bottom-7 text-gray-500 z-50"
                      >
                        {showPassword ? (
                          <FaRegEyeSlash className="text-white" />
                        ) : (
                          <FaRegEye />
                        )}
                      </button>
                    )}
                    {item === "email" && (
                      <div className="relative">
                        <p className=" text-sm text-red-400 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {["address", "city", "state" ,"postalcode"].map((item) => (
                  <div key={item}>
                    <label
                      htmlFor={item}
                      className="block text-sm font-medium text-white capitalize"
                    >
                      {item}
                    </label>
                    <input
                      type="text"
                      name={item}
                      id={item}
                      value={formData[item]}
                      onChange={handleChange}
                      maxLength={item === "postalcode" ? 6 : undefined}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm  p-2 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Submit Button - Full Width Below Both Columns */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition-all"
                >
                  Send otp
                </button>
              </div>
            </form>

          </>
        )}
      </div>
    </motion.div>
  );
};

export default Update;
