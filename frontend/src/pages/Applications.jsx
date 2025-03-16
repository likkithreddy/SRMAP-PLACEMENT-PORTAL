import { useState, useEffect } from "react";
import axios from "axios";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
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
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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

  const openInterviewModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const scheduleInterview = async () => {
    if (!interviewDate) {
      alert("Please select a valid interview date and time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/jobs/apply/applications/${selectedApplication._id}`,
        { status: "Interview Scheduled", interviewDate },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app._id === selectedApplication._id
              ? { ...app, status: "Interview Scheduled", interviewDate }
              : app
          )
        );
        setShowModal(false);
        setInterviewDate("");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  return (
    <>
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
                <tr className="text-white bg-gray-800" style={{ backgroundColor: "#4D4D29" }}>
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
                  <tr
                    key={app._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3 whitespace-nowrap">{app.studentName}</td>
                    <td className="p-3 whitespace-nowrap">{app.studentEmail}</td>
                    <td className="p-3 whitespace-nowrap">{app.title}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                          app.status === "Pending"
                            ? "bg-yellow-500"
                            : app.status === "Accepted"
                            ? "bg-green-500"
                            : app.status === "Interview Scheduled"
                            ? "bg-blue-500"
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
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(app._id, "Accepted")}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, "Rejected")}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => openInterviewModal(app)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Schedule Interview
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              Schedule Interview
            </h2>
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={scheduleInterview}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Schedule
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Applications;
