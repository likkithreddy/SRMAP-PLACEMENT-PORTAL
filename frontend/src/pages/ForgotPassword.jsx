import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage1 from "../assets/Aerial2.avif";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Function to send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email!");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:4000/api/auth/verify-otp", { email, otp });
      toast.success("OTP Verified! Redirecting...");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `url(${backgroundImage1})`, width: "100%", backgroundSize: "cover" }}
    >
      {/* <div className="flex items-center justify-center min-h-screen bg-gray-100"> */}
        <ToastContainer />
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold text-center">{step === 1 ? "Forgot Password" : "Verify OTP"}</h2>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="mt-4">
              <label className="block text-gray-700">Enter your email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full mt-4 p-2 text-white rounded bg-blue-500 hover:bg-blue-600"
                disabled={loading}
                style={{ backgroundColor: "#4D4D29" }}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="mt-4">
              <label className="block text-gray-700">Enter OTP</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full mt-4 p-2 text-white rounded bg-green-500 hover:bg-green-600"
                disabled={loading}
                style={{ backgroundColor: "#4D4D29" }}>
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    // </div>
  );
};

export default ForgotPassword;
