import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBriefcase, FaCalendarAlt, FaClipboardList, FaUser } from "react-icons/fa";

const StudentDashboard = () => {
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    passportSizePhoto: "https://via.placeholder.com/100",
  });

  const [dashboardStats, setDashboardStats] = useState({
    applications: 8,
    interviews: 3,
    offers: 2,
  });

  const [upcomingInterviews, setUpcomingInterviews] = useState([
    { id: 1, companyName: "Google", position: "Software Engineer", date: "March 10, 2025" },
    { id: 2, companyName: "Microsoft", position: "Cloud Developer", date: "March 15, 2025" },
    { id: 3, companyName: "Amazon", position: "AI Engineer", date: "March 20, 2025" },
  ]);

  const [jobListings, setJobListings] = useState([
    { id: 1, title: "Full Stack Developer", company: "Amazon", location: "Remote", salary: "$80K" },
    { id: 2, title: "AI Engineer", company: "Tesla", location: "California, USA", salary: "$100K" },
    { id: 3, title: "Cybersecurity Analyst", company: "IBM", location: "New York, USA", salary: "$90K" },
  ]);

  return (
    <div className="mt-20 bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Welcome, {userData.firstName}!</h2>
          <p className="text-gray-600">Your student dashboard overview</p>
        </div>
        <img
          src={userData.passportSizePhoto}
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
            <ul>
              {upcomingInterviews.map((interview) => (
                <li key={interview.id} className="border-b py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold">{interview.companyName}</p>
                      <p className="text-gray-600">{interview.position}</p>
                    </div>
                    <p className="text-gray-500">{interview.date}</p>
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
                      <p className="text-gray-600">{job.company} - {job.location}</p>
                      <p className="text-gray-500 font-semibold">{job.salary}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button>
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
