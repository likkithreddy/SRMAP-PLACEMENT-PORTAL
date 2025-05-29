import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${baseURL}/api/jobs/apply/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) return <p className="text-center text-gray-600">Loading job details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-16 min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        {/* Company Logo */}
        <div className="flex items-center space-x-4 mb-6">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt="Company Logo" className="h-16 w-16 rounded-full border border-gray-300" />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">🏢</div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
            <p className="text-lg text-gray-600">{job.company}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">Location:</span> {job.location}</p>
          <p><span className="font-semibold">Salary:</span> {job.salary} LPA</p>
          <p><span className="font-semibold">Job Type:</span> {job.jobType}</p>
          <p><span className="font-semibold">Category:</span> {job.category}</p>
          <p><span className="font-semibold">Min CGPA:</span> {job.minCGPA}</p>
          <p><span className="font-semibold">Experience:</span> {job.experience}</p>
          <p><span className="font-semibold">Applied At:</span> {new Date(job.appliedAt).toLocaleString()}</p>
          <p><span className="font-semibold">Interview Date:</span> {job.interviewDate ? new Date(job.interviewDate).toLocaleString() : "Not Scheduled"}</p>
        </div>

        {/* Job Description */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-800">Job Description</h2>
          <p className="text-gray-600 mt-2">{job.description}</p>
        </div>

        {/* Student Details */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Applicant Details</h2>
          <p className="text-gray-600"><span className="font-semibold">Name:</span> {job.studentName}</p>
          <p className="text-gray-600"><span className="font-semibold">Email:</span> {job.studentEmail}</p>
          <p className="text-gray-600"><span className="font-semibold">Application Status:</span> 
            <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${
              job.status === "Interview Scheduled" ? "bg-blue-500" :
              job.status === "Accepted" ? "bg-green-500" : "bg-yellow-500"
            }`}>
              {job.status}
            </span>
          </p>
        </div>

        {/* Resume Download */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Resume</h2>
          <a
            href={job.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Resume
          </a>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            style={{ backgroundColor: "#4D4D29" }}>
            Back to Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
