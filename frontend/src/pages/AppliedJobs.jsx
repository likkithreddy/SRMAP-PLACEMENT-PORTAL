import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view applied jobs.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseURL}/api/jobs/apply/applied`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppliedJobs(response.data.appliedJobs || []);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        setError("Failed to load applied jobs. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleWithdrawApplication = async (jobId) => {
    console.log(jobId);
    
    const confirmWithdraw = window.confirm("Are you sure you want to withdraw your application?");
    if (!confirmWithdraw) return;

    try {

      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/api/jobs/apply/applications/withdraw/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppliedJobs(appliedJobs.filter((job) => job._id !== jobId));
      toast.success("Application withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error("Failed to withdraw application. Try again later.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-16 min-h-screen bg-gray-50 p-6">
      <ToastContainer/>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Applied Jobs</h1>

      {appliedJobs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">You haven't applied for any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 duration-200"
            >
              {/* Company Logo */}
              <div className="flex items-center space-x-3 mb-4">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={`${job.company} Logo`}
                    className="h-12 w-12 object-cover rounded-full border border-gray-300"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full">
                    🏢
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>

              {/* Job Details */}
              <p className="text-gray-500">
                <span className="font-semibold">Location:</span> {job.location}
              </p>
              <p className="text-gray-500">
                <span className="font-semibold">Salary:</span> {job.salary} LPA
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-semibold">Applied on:</span> {new Date(job.appliedAt).toLocaleDateString()}
              </p>

              {/* Status Badge */}
              <p className=" mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                    job.status === "Pending"
                      ? "bg-yellow-500"
                      : job.status === "Accepted"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {job.status || "Pending"}
                </span>
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between">
                <Link to={`/job-details/${job._id}`}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"style={{ backgroundColor: "#4D4D29" }}>
                    View Details
                  </button>
                </Link>
                <button
                  onClick={() => handleWithdrawApplication(job._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition" style={{ backgroundColor: "#4D4D29" }}
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
