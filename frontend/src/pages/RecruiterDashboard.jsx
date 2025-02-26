import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all jobs posted by the recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/jobs/recruiter",{
        headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${localStorage.getItem("token")}` },

        });
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Handle Delete Job
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/jobs/${jobId}`,{
        headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${localStorage.getItem("token")}` },

      });
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  // Open Edit Modal
  const openEditModal = (job) => {
    setEditJob(job);
    setShowModal(true);
  };

  // Handle Job Update
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/api/jobs/${editJob._id}`, editJob,{
        headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${localStorage.getItem("token")}` },

      });
      setJobs(jobs.map((job) => (job._id === editJob._id ? editJob : job)));
      setShowModal(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="mt-16  min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Your Posted Jobs</h1>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="bg-white p-6 shadow-md rounded-md">
                {/* Job Header */}
                <div className="flex items-center space-x-3 mb-4">
                  {job.companyLogo && (
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} Logo`}
                      className="h-10 w-10 object-cover rounded-full shadow-md"
                    />
                  )}
                  <h2 className="text-lg font-bold text-gray-800">{job.company}</h2>
                </div>

                {/* Job Details */}
                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                <p className="text-gray-600">{job.location}</p>
                <p className="mt-2 text-gray-700">{job.description.slice(0, 100)}...</p>

                {/* Min CGPA & LPA */}
                <div className="mt-4 flex justify-between text-sm text-gray-700">
                  <p><strong>Min CGPA:</strong> {job.minCGPA || "N/A"}</p>
                  <p><strong>LPA:</strong> {job.salary || "N/A"} LPA</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    onClick={() => openEditModal(job)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No jobs posted yet</p>
          )}
        </div>
      </div>

      {/* Edit Job Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Job</h2>

            <label className="block mb-2">Job Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              value={editJob.title}
              onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
            />

            <label className="block mb-2">Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              value={editJob.location}
              onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
            />

            <label className="block mb-2">Min CGPA</label>
            <input
              type="number"
              step="0.1"
              className="w-full p-2 border rounded-md mb-4"
              value={editJob.minCGPA}
              onChange={(e) => setEditJob({ ...editJob, minCGPA: e.target.value })}
            />

            <label className="block mb-2">LPA</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md mb-4"
              value={editJob.salary}
              onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
