import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import backgroundImage1 from "../assets/Aerial2.avif";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const toastId = toast.loading("Logging in...");

    

    try {
      const url = `http://localhost:4000/api/${role === "student" ? "students" : "recruiters"}/auth/login`;
      const response = await axios.post(url, { email, password });

      console.log("Login Successful:", response.data);
      localStorage.setItem("token", response.data.token);

      login(role);
      // toast.success("Login successful! Redirecting...");
      toast.update(toastId, {
        render: "Login successful! Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => navigate("/jobs"), 1500); // Delay navigation for better UX
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `url(${backgroundImage1})`, width: "100%", backgroundSize: "cover" }}
    >
      <ToastContainer  />
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold text-center">Placement Portal Login</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white p-2 rounded hover:bg-opacity-90"
            style={{ backgroundColor: "#4D4D29" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {role === "student" ? (
          <p className="text-sm text-center text-gray-600">
            Don't have an account? <Link to="/StudentRegister" className="text-indigo-500 hover:underline">Register</Link>
          </p>
        ) : (
          <p className="text-sm text-center text-gray-600">
            Don't have an account? <Link to="/RecruiterRegister" className="text-indigo-500 hover:underline">Register</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
