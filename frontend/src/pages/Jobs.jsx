import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const baseURL = import.meta.env.VITE_BACKEND_URL;


  // Fetch job data from database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/jobs`,
          {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },

          }
        );
        console.log(response.data.jobs);

        setJobs(response.data.jobs); // Assuming API returns an array of jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Filtered Jobs
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory ? job.category === filterCategory : true) &&
      (filterLocation ? job.location === filterLocation : true)
  );

  return (
    <div>
      {/* <Navbar /> */}
      <div className="mt-16 min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Available Jobs</h1>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow-md rounded-md mb-6">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-200 p-2 rounded-md w-full md:w-1/3">
            <FaSearch className="text-gray-500 mx-2" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <select
              className="bg-gray-200 p-2 rounded-md"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Software">Software</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              className="bg-gray-200 p-2 rounded-md"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-white p-6 shadow-md rounded-md">
                {/* Job Header (Logo + Company Name) */}
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
                <a
                  href={job.descriptionFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Description File
                </a>

                {/* Min CGPA & LPA */}
                <div className="mt-4 flex justify-between text-sm text-gray-700">
                  <p><strong>Min CGPA:</strong> {job.minCGPA || "N/A"}</p>
                  <p><strong>Salary:</strong> {job.salary || "N/A"} LPA</p>
                </div>

                {/* Apply Now Button */}
                <Link to={`/apply-job/${job._id}`}>
                  <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" style={{ backgroundColor: "#4D4D29" }}>
                    Apply Now
                  </button>
                </Link>

              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No jobs found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
