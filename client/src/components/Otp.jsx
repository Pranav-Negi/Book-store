import React, { useState } from "react";
import { useToast } from "../Context/Toast";

import { useNavigate } from "react-router-dom";

const Otp = ({ close, email  ,submit  }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Only digits allowed
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    submit(otpCode);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#2b2b2b] flex justify-center items-center z-50">
      <div className="bg-[#3a3a3a]/80 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">Enter OTP</h2>
        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength="1"
              className="w-10 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
            />
          ))}
        </div>
        <h1>otp sent on {email} </h1>
        <div className="flex justify-between my-2">
          <button
            onClick={close}
            className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;