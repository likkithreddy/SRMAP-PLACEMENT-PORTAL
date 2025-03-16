import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Get job ID from URL
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const [job, setJob] = useState(null); // Store job details

  useEffect(() => {
    // Fetch job details
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/jobs/${jobId}`, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Fetched Job:", response.data);
        setJob(response.data.job); // Store job details
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to fetch job details.");
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!resume) {
      toast.warn("Please upload a resume before applying.");
      return;
    }

    setApplying(true);
    const formData = new FormData();
    formData.append("resume", resume);

    // Add job details to formData
    formData.append("jobId", jobId);
    formData.append("title", job.title);
    formData.append("company", job.company);
    formData.append("location", job.location);
    formData.append("salary", job.salary);
    formData.append("minCGPA", job.minCGPA);
    formData.append("jobType", job.jobType);
    formData.append("category", job.category);
    formData.append("experience", job.experience);
    formData.append("description", job.description);
    formData.append("companyLogo", job.companyLogo);

    try {
      console.log("Applying for job with ID:", jobId);

      const response = await axios.post(
        `http://localhost:4000/api/jobs/apply/${jobId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if(response.data.success){
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);

      }
      if (response.status === 200) {
        setTimeout(() => navigate("/jobs"), 2000); // Redirect after success
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply. Try again later.");
    } finally {
      setApplying(false);
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <div className="bg-white p-6 shadow-md rounded-md w-96 mx-auto mt-24">
      {/* Company Logo */}
      <ToastContainer  />

      {job.companyLogo && (
        <img src={job.companyLogo} alt="Company Logo" className="h-16 mx-auto mb-4" />
      )}

      <h2 className="text-xl font-bold text-blue-700">{job.title}</h2>
      <p className="text-gray-600 font-semibold">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>
      <p className="mt-2 text-sm">{job.description}</p>

      {/* Job Details */}
      <div className="mt-4 text-gray-700 space-y-2">
        <p><strong>Category:</strong> {job.category}</p>
        <p><strong>Job Type:</strong> {job.jobType}</p>
        <p><strong>Experience Level:</strong> {job.experience}</p>
        <p><strong>Minimum CGPA:</strong> {job.minCGPA}</p>
        <p><strong>Salary:</strong> {job.salary} LPA</p>
      </div>

      {/* Resume Upload */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResume(e.target.files[0])}
        className="mt-4 p-2 border rounded-md w-full"
      />

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={applying}
        className="mt-4 bg-blue-600 text-white px-4 py-2 w-full rounded-md hover:bg-blue-700 transition"
      >
        {applying ? "Applying..." : "Apply Now"}
      </button>
    </div>
  );
};

export default ApplyJob;
