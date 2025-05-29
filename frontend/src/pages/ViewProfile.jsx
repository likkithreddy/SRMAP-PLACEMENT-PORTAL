import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCloudUploadAlt, FaSave, FaTimes } from "react-icons/fa";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, [token]);

  const handleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, [field]: file });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (typeof userData[key] === "string" || typeof userData[key] === "number") {
          formData.append(key, userData[key]);
        }
      });
      if (userData.passportSizePhoto instanceof File) {
        formData.append("passportSizePhoto", userData.passportSizePhoto);
      }
      if (userData.resume instanceof File) {
        formData.append("resume", userData.resume);
      }
      if (userData.authorizationLetter instanceof File) {
        formData.append("authorizationLetter", userData.authorizationLetter);
      }
      await axios.put(`${baseURL}/api/user/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="mt-20 bg-gray-100 min-h-screen p-6">
      <ToastContainer/>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {userData.role === "student" ? `${userData.firstName} ${userData.lastName}` : userData.recruiterName}
          </h2>
          <p className="text-gray-600 capitalize">{userData.role} Profile</p>
        </div>
        <img
          src={
            userData.passportSizePhoto instanceof File
              ? URL.createObjectURL(userData.passportSizePhoto)
              : userData.passportSizePhoto || "https://via.placeholder.com/100"
          }
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-gray-300"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(userData).map((key) => (
            key !== "password" &&
            key !== "_id" &&
            key !== "__v" &&
            key !== "createdAt" &&
            key !== "updatedAt" && (
              <div key={key} className="flex flex-col">
                <label className="text-gray-700 font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                {key === "dateOfBirth" ? (
                  isEditing ? (
                    <input
                      type="date"
                      name={key}
                      value={new Date(userData[key]).toISOString().split("T")[0]}
                      onChange={handleChange}
                      className="p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 border rounded-md">
                      {new Date(userData[key]).toLocaleDateString("en-GB")}
                    </p>
                  )
                ) : typeof userData[key] === "string" && userData[key].includes("http") ? (
                  key.includes("resume") || key.includes("authorizationLetter") ||key.includes("companyWebsite") ? (
                    <a href={userData[key]} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View {key.replace(/([A-Z])/g, " $1")}
                    </a>
                  ) : (
                    <img src={userData[key]} alt={key} className="w-24 h-24 rounded-md border" />
                  )
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={userData[key]}
                    onChange={handleChange}
                    className="p-2 border rounded-md"
                    disabled={!isEditing}
                  />
                )}

              </div>
            )
          ))}
        </div>

        {isEditing && (
          <div className="mt-6 space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <FaCloudUploadAlt />
              <span>Update Profile Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "passportSizePhoto")} />
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <FaCloudUploadAlt />
              <span>Update Resume</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, "resume")} />
            </label>
          </div>
        )}

        <div className="mt-6 flex justify-start">
          <button className={`px-4 py-2 rounded-md flex items-center ${isEditing ? "bg-red-500" : "bg-gray-800"} text-white`} onClick={handleEdit}>
            {isEditing ? <FaTimes className="mr-2" /> : <FaEdit className="mr-2" />}
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
          {isEditing && (
            <button className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center" onClick={handleSave}>
              <FaSave className="mr-2" /> Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
