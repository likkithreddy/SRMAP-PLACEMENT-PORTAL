import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import backgroundImage1 from "../assets/Aerial2.avif";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentRegister = () => {
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    qualification: '',
    percentage: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    resume: null,
    photo: null,
    password: '',
    confirmPassword: '',
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

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    // toast.loading("Logging in...");

    setIsRegistering(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] && key !== 'confirmPassword') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post('http://localhost:4000/api/students/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      console.log('Registration Successful:', response.data);
      localStorage.setItem("token", response.data.token);

      toast.success('Registration Successful! ');
      login("student");
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        qualification: '',
        cgpa: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        resume: null,
        passportSizePhoto: null,
        password: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ backgroundImage: `url(${backgroundImage1})`, backgroundSize: 'cover' }}>
      <ToastContainer />

       <div className="absolute top-5 right-5 flex gap-4">
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" style={{ backgroundColor: "#4D4D29" }}>Login</button>
        <button onClick={() => navigate('/RecruiterRegister')} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" style={{ backgroundColor: "#4D4D29" }}>Recruiter Register</button>
      </div>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 my-10">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Student Registration</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Personal Details */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-700">Personal Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Password Section */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-700">Password</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Education Qualification */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-700">Education Qualification</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Percentage/CGPA</label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Address Details */}
          {/* ... The rest remains the same */}
          {/* Address Details */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-700">Address Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Important Attachments */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-700">Important Attachments</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Resume</label>
                <input type="file" name="resume" onChange={handleChange} className="w-full mt-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Passport Size Photo</label>
                <input type="file" name="passportSizePhoto" onChange={handleChange} className="w-full mt-1" />
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full py-3 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none"
            style={{ backgroundColor: "#4D4D29" }}>
            {isRegistering ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
