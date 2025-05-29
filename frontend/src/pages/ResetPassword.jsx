import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage1 from "../assets/Aerial2.avif";


const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {}; // Get email from previous page

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BACKEND_URL;


  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Invalid request. Try again.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match!");

    setLoading(true);

    try {
      await axios.post(`${baseURL}/api/auth/reset-password`, { email, password });
      toast.success("Password reset successfully! Redirecting...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `url(${backgroundImage1})`, width: "100%", backgroundSize: "cover" }}
    >
      {/* // <div className="flex items-center justify-center min-h-screen bg-gray-100"> */}
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <form onSubmit={handleReset} className="mt-4">
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block text-gray-700 mt-4">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full mt-4 p-2 text-white rounded bg-green-500 hover:bg-green-600"
            disabled={loading}
            style={{ backgroundColor: "#4D4D29" }}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
