import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/Toast";
import Loader from "../components/Loader";
import { uploadbook } from "../api/Admin";

const Upload = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const [spinner, setspinner] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: [],
    stock: "",
    discount: "",
    image: null,
    preview: [],
  });

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "preview") {
      const fiearray = Array.from(files).slice(0, 5);
      console.log(fiearray)
      setFormData((prev)=> ({
        ...prev,
        preview:[...prev.preview, ...fiearray].slice(0,5)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setspinner(true);

  try {
    const userid = localStorage.getItem("userid");
    if (!userid) {
      alert("Please login");
      return;
    }

    // Create FormData object
    const formDataToSend = new FormData();
    
    // Append regular fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("discount", formData.discount);
    
    // Append main image (single file)
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    
    // Append preview images (multiple files)
    formData.preview.forEach((file, index) => {
      formDataToSend.append(`preview`, file); // Note: Must match Multer config exactly
    });

    await uploadbook(userid, formDataToSend); // Make sure your API accepts FormData
    setspinner(false);
    showToast("Book registered", "success");
    navigate("/books")
  } catch (error) {
    console.log(error);
    showToast("Upload failed", "error");
  } finally {
    setspinner(false);
  }
};

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {spinner ? <Loader /> : ""}
      <div className="w-full max-w-3xl bg-[#3a3a3a]/80 rounded-lg p-6 shadow-lg text-white">
        
          <>
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              upload Book
            </h2>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* Left Column */}
              <div className="space-y-4">
                {["title", "author", "description", "category", "stock"].map(
                  (item) => (
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
                    </div>
                  )
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {["price", "discount", "image", "preview"].map((item) => (
                  <div key={item} className="flex flex-col gap-2">
                    <label
                      htmlFor={item}
                      className="block text-sm font-medium text-white capitalize"
                    >
                      {item}
                    </label>
                    <input
                      type={
                        item === "image" || item === "preview" ? "file" : "text"
                      }
                      name={item}
                      id={item}
                      {...(item === "image" || item === "preview"
                        ? {}
                        : { value: formData[item] })}
                      onChange={handleChange}
                      required
                      className={`mt-1 ${item ==="image" || item === "preview" ? "w-[105px]" : "w-full"} border border-gray-300 rounded-md shadow-sm  p-2 focus:outline-none`}
                    />
                    {formData.image && item ==="image" && (
                      <span className="text-sm text-gray-300">
                        {formData.image.name}
                      </span>
                    )}
                    {formData.preview && item ==="preview" && (
                      <div className="text-sm text-gray-300 flex flex-col gap-2">
                        {formData.preview.map((item,index)=> (
                            <span key={index}>
                                {item.name}
                            </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button - Full Width Below Both Columns */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition-all"
                >
                 Upload Book
                </button>
              </div>
            </form>
          </>
      </div>
    </motion.div>
  );
};

export default Upload;
