import { useState } from "react";
import axios from "axios"; // Import Axios
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    minCGPA: "",
    jobType: "Full-Time",
    category: "Software",
    experience: "Entry Level",
    description: "",
    descriptionFile: null,
    companyLogo: null
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };


  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Append text fields
      for (const key in formData) {
        if (key !== "descriptionFile" && key !== "companyLogo") {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      // Append files separately
      if (formData.descriptionFile) {
        formDataToSend.append("descriptionFile", formData.descriptionFile);
      }
      if (formData.companyLogo) {
        formDataToSend.append("companyLogo", formData.companyLogo);
      }
      // console.log(formDataToSend);
      // console.log(formData);
      
      // ✅ Send Data to Backend
      const response = await axios.post("http://localhost:4000/api/jobs", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (response.status === 201) {
        toast.success("Job Posted Successfully!");
        setTimeout(() => {
          navigate("/recruiter-dashboard");
          
        }, 1000);
        setFormData({
          title: "",
          company: "",
          location: "",
          salary: "",
          minCGPA: "",
          jobType: "Full-Time",
          category: "Software",
          experience: "Entry Level",
          description: "",
          descriptionFile: null,
          companyLogo: null, 
        });
      } else {
        toast.error("Failed to post job.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("An error occurred while posting the job.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <>
      {/* <Navbar /> */}
      <div className="mt-20 max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <ToastContainer/>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Post a Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Job Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Company Name */}
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Salary */}
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary (e.g., 50,000/year)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Job Type */}
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Category */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Software">Software</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Experience Level */}
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>

            {/* Minimum CGPA */}
            <input
              type="number"
              name="minCGPA"
              value={formData.minCGPA}
              onChange={handleChange}
              placeholder="Minimum CGPA"
              
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Job Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full p-3 border border-gray-300 rounded-lg h-28 focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          {/* Company Logo Upload */}
          <div className="p-4 border border-gray-300 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Upload Company Logo (Image)</label>
            <input
              type="file"
              name="companyLogo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>


          {/* File Upload (PDF) */}
          <div className="p-4 border border-gray-300 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Upload Job Description (PDF)</label>
            <input
              type="file"
              name="descriptionFile"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white font-semibold p-3 rounded-lg hover:bg-opacity-90 transition"
            style={{ backgroundColor: "#4D4D29" }}
            disabled={loading}
          >
            {loading ? "Posting Job..." : "Post Job"}
          </button>
        </form>
      </div>
    </>
  );
};

export default PostJob;
