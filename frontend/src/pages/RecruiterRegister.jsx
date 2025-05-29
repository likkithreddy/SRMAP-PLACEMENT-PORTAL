import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios
import backgroundImage1 from "../assets/Aerial2.avif";
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecruiterRegister = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const baseURL = import.meta.env.VITE_BACKEND_URL;


  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    companyEmail: "",
    contactNumber: "",
    recruiterName: "",
    recruiterEmail: "",
    designation: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    password: "",
    confirmPassword: "",
    companyLogo: null,
    authorizationLetter: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsRegistering(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "confirmPassword") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${baseURL}/api/recruiters/auth/register`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Registration Successful! ');
        localStorage.setItem("token", response.data.token);

        login("recruiter");
        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 2000);
      } else {
        alert(`Registration failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center bg-gray-100" style={{ backgroundImage: `url(${backgroundImage1})`, width: "100%", backgroundSize: "cover" }}>
        <ToastContainer />

        <div className="absolute top-5 right-5 flex gap-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" style={{ backgroundColor: "#4D4D29" }}>Login</button>
          <button onClick={() => navigate('/StudentRegister')} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" style={{ backgroundColor: "#4D4D29" }}>Student Register</button>
        </div>
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 my-10">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Recruiter Registration</h2>
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Company Details */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-700">
                Company Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Website
                  </label>
                  <input
                    type="text"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., https://company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </fieldset>

            {/* Recruiter Information */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-700">
                Recruiter Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recruiter's Name
                  </label>
                  <input
                    type="text"
                    name="recruiterName"
                    value={formData.recruiterName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recruiter's Email
                  </label>
                  <input
                    type="email"
                    name="recruiterEmail"
                    value={formData.recruiterEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., HR Manager"
                  />
                </div>
              </div>
            </fieldset>
            {/* Password Fields */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-700">Password</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                </div>
              </div>
            </fieldset>

            {/* Address Details */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-700">
                Address Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </fieldset>

            {/* Important Attachments */}
            <fieldset>
              <legend className="text-lg font-semibold text-gray-700">
                Important Attachments
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="companyLogo"
                    onChange={handleChange}
                    className="w-full mt-1"

                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Authorization Letter
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    name="authorizationLetter"
                    onChange={handleChange}
                    className="w-full mt-1"

                  />
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full py-3 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{ backgroundColor: "#4D4D29" }}>
              {isRegistering ? 'Registering...' : 'Register'}

            </button>




          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruiterRegister;
