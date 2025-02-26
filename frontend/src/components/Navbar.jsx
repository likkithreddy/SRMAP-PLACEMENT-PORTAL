import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes,FaUserCircle } from "react-icons/fa";
import logo from "../assets/srm_logo.png"; // Add your logo path
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout, user } = useContext(AuthContext); // Assuming `user` contains profile data
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuthenticated) return null; // Hide navbar if not logged in

  // Function to handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clears all stored items
    logout();
    setIsProfileOpen(!isProfileOpen); // Calls logout function from AuthContext
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="fixed top-0 w-[100%] text-white p-4 flex items-center justify-between shadow-md" style={{ backgroundColor: "#4D4D29" }}>
      {/* Logo on the Left */}
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-10 w-20" />
      </Link>

      {/* Navigation Links & Profile (Hidden on Mobile) */}
      <div className="hidden md:flex items-center space-x-12">
        {userType === "student" ? (
          <>
            <Link to="/student-dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/jobs" className="hover:underline">Jobs</Link>
            <Link to="/student-jobs" className="hover:underline">Applied Jobs</Link>
          </>
        ) : (
          <>
            <Link to="/recruiter-dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/jobs" className="hover:underline">Jobs</Link>
            <Link to="/post-job" className="hover:underline">Post Job</Link>
            <Link to="/applications" className="hover:underline">Applications</Link>
          </>
        )}

        {/* Profile Section */}
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <FaUserCircle size={28} className="cursor-pointer" />
            )}
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-md z-30">
              <Link onClick={() => setIsProfileOpen(false)} to="/profile" className="block px-4 py-2 hover:bg-gray-200">View Profile</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-700 flex flex-col items-center space-y-4 py-4 md:hidden">
          {userType === "student" ? (
            <>
              <Link to="/student-dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
              <Link to="/student-jobs" onClick={() => setIsMenuOpen(false)}>Applied Jobs</Link>
            </>
          ) : (
            <>
              <Link to="/recruiter-dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
              <Link to="/post-job" onClick={() => setIsMenuOpen(false)}>Post Job</Link>
              <Link to="/applications" onClick={() => setIsMenuOpen(false)}>Applications</Link>
            </>
          )}

          {/* Profile in Mobile View */}
          <Link to="/profile" className="block text-center" onClick={() => setIsMenuOpen(false)}>View Profile</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
