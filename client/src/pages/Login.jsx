import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { login } from "../api/Userapi";
import { useToast } from "../Context/Toast";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import Loader from "../components/Loader"
import { useUser } from "../Context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const [spinner , setspinner] = useState(false)
  const { setuserid} = useUser()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setspinner(true)
      const response = await login(formData);
      console.log("Login Response:", response);
      localStorage.setItem("token", response.token);
      setuserid(response.id)
      showToast("Login successful!", "success");
      navigate("/home");
    } catch (error) {
      showToast("Username or password is incorrect", "error");
      console.error("Login Error:", error);
    }finally{
      setspinner(false)
    }
    // Add login logic here
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
    {spinner ? <Loader/> :""}
      <div className="bg-[#3a3a3a]/80 rounded-lg p-6 shadow-lg text-white w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Password visibility toggle */
            <div className="relative left-11/12 bottom-11">
              <button 
              type="button"
              className="cussor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEye/> : <FaRegEyeSlash />}
              </button>
            </div>
          }
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition-all"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-white mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-yellow-500 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;