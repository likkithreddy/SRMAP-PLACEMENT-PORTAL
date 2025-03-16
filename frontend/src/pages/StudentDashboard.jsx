import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBriefcase, FaCalendarAlt, FaClipboardList } from "react-icons/fa";

const StudentDashboard = () => {
  const [userData, setUserData] = useState({});
  const [dashboardStats, setDashboardStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [jobListings, setJobListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch user profile
        const { data: userProfile } = await axios.get("http://localhost:4000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userProfile.user);

        // Fetch applied jobs
        const { data } = await axios.get("http://localhost:4000/api/jobs/apply/applied", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appliedJobs = data.appliedJobs;

        // Fetch job listings
        const { data: jobsData } = await axios.get("http://localhost:4000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set dashboard stats
        setDashboardStats({
          applications: appliedJobs.length,
          interviews: appliedJobs.filter((job) => job.status === "Interview Scheduled").length,
          offers: appliedJobs.filter((job) => job.status === "Offer Received").length,
        });

        // Set upcoming interviews (add mode/meetingLink/location if available)
        setUpcomingInterviews(
          appliedJobs
            .filter((job) => job.status === "Interview Scheduled")
            .map((job) => ({
              id: job._id,
              companyName: job.company,
              position: job.position,
              date: job.interviewDate,
              status: job.status, 
              mode: job.mode || "online",      // e.g., "online" or "in-person"
              meetingLink: job.meetingLink || "",
              location: job.location || "N/A",
            }))
        );

        setJobListings(jobsData.jobs);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-20 bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Welcome, {userData.firstName}!</h2>
          <p className="text-gray-600">Your student dashboard overview</p>
        </div>
        <img
          src={userData.passportSizePhoto || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-gray-300"
        />
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaClipboardList className="text-blue-500 text-3xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">{dashboardStats.applications}</h3>
            <p className="text-gray-600">Applications Submitted</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaCalendarAlt className="text-green-500 text-3xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">{dashboardStats.interviews}</h3>
            <p className="text-gray-600">Upcoming Interviews</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <FaBriefcase className="text-yellow-500 text-3xl mr-4" />
          <div>
            <h3 className="text-xl font-semibold">{dashboardStats.offers}</h3>
            <p className="text-gray-600">Job Offers Received</p>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Upcoming Interviews</h3>
        <div className="bg-white shadow-md rounded-lg p-6">
          {upcomingInterviews.length === 0 ? (
            <p className="text-gray-600">No upcoming interviews</p>
          ) : (
            <ul className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <li
                  key={interview.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow transition"
                >
                  {/* Header: Company & Position */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {interview.companyName}
                      </h4>
                      <p className="text-gray-600">{interview.position}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(interview.date).toLocaleString()}
                    </span>
                  </div>

                  {/* Additional Info: mode, meetingLink, location, status */}
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="mb-1">
                      <strong>Mode:</strong>{" "}
                      {interview.mode === "online" ? "Online" : "In-person"}
                    </p>
                    {interview.mode === "online" ? (
                      <p className="mb-1">
                        <strong>Meeting Link:</strong>{" "}
                        <a
                          href={interview.meetingLink}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {interview.meetingLink}
                        </a>
                      </p>
                    ) : (
                      <p className="mb-1">
                        <strong>Location:</strong> {interview.location}
                      </p>
                    )}
                    <p className="mt-2 inline-block px-2 py-1 text-sm bg-green-100 text-green-700 rounded">
                      {interview.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Latest Job Listings</h3>
        <div className="bg-white shadow-md rounded-lg p-6">
          {jobListings.length === 0 ? (
            <p className="text-gray-600">No new job listings</p>
          ) : (
            <ul>
              {jobListings.map((job) => (
                <li key={job.id} className="border-b py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold">{job.title}</p>
                      <p className="text-gray-600">
                        {job.company} - {job.location}
                      </p>
                      <p className="text-gray-500 font-semibold">{job.salary}</p>
                    </div>
                    <button
                      className="bg-blue-500 text-white px-4 py-0.5 rounded"
                      style={{ backgroundColor: "#4D4D29" }}
                    >
                      Apply
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
