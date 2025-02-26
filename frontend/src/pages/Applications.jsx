import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Navbar from "../components/Navbar";

const Applications = () => {
  const [applications, setApplications] = useState([]); // Removed dummy data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage

        const response = await axios.get(
          "http://localhost:4000/api/jobs/apply/applications",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchApplications();
  }, []);

  // Function to handle Accept or Reject
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:4000/api/jobs/apply/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the UI instantly
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      console.error(`Error updating application status: ${error}`);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="mt-20 max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Job Applications
        </h2>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center p-5 text-gray-500">Loading...</p>
          ) : applications.length > 0 ? (
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="text-white" style={{ backgroundColor: "#4D4D29" }}>
                  <th className="p-3 text-left">Candidate</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Job Title</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Resume</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3">{app.studentName}</td>
                    <td className="p-3">{app.studentEmail}</td>
                    <td className="p-3">{app.title}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                          app.status === "Pending"
                            ? "bg-yellow-500"
                            : app.status === "Accepted"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleStatusChange(app._id, "Accepted")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mx-1"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, "Rejected")}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mx-1"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-5 text-gray-500">No applications found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Applications;
