import applicationModel from "../models/ApplicationModel.js";
import jobModel from "../models/jobModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import userModel from "../models/userModel.js";

const applyJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        const studentId = req.user._id; // Get student ID from authenticated user

        const student = await userModel.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        if (!req.files || !req.files.resume) {
            return res.status(400).json({ error: "Resume is required" });
        }

        let resumeUrl = null;

        // Upload Resume to Cloudinary
        if (req.files.resume) {
            resumeUrl = await uploadOnCloudinary(req.files.resume[0].path, "raw");
        }

        // Check if job exists
        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if student already applied
        const existingApplication = await applicationModel.findOne({ student: studentId, job: jobId });
        if (existingApplication) {
            return res.json({ message: "You have already applied for this job", success: false });
        }

        // Create a new job application with job details
        const newApplication = new applicationModel({
            student: studentId,
            studentName: student.firstName,
            studentEmail: student.email,
            job: jobId,
            resume: resumeUrl, // Store the Cloudinary URL
            status: "Pending", // Default status
            appliedAt: Date.now(),
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            minCGPA: job.minCGPA,
            jobType: job.jobType,
            category: job.category,
            experience: job.experience,
            description: job.description,
            companyLogo: job.companyLogo,
        });

        await newApplication.save();

        res.status(200).json({
            message: "Application submitted successfully",
            success: true,
            application: newApplication,
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAppliedJobs = async (req, res) => {
    try {
        const studentId = req.user.id; // Ensure authentication
        const applications = await applicationModel.find({ student: studentId });

        res.json({ appliedJobs: applications });
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getJobApplications = async (req, res) => {
    try {
        const recruiterId = req.user._id;
        console.log(recruiterId);

        // Find all jobs posted by the recruiter
        const jobs = await jobModel.find({ recruiter: recruiterId });

        if (!jobs.length) {
            return res.status(404).json({ message: "No jobs found for this recruiter." });
        }

        const jobIds = jobs.map((job) => job._id);

        // Find applications for those jobs
        const applications = await applicationModel.find({ job: { $in: jobIds } })
            .populate("student", "name email")
            .populate("job", "title");

        res.json(applications);
    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update application status (Accept/Reject)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params; // Application ID
        const { status } = req.body;

        if (!["Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update." });
        }

        const application = await applicationModel.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        application.status = status;
        await application.save();

        res.json({ message: `Application ${status.toLowerCase()} successfully.` });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const withdrawApplication = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      console.log(id,userId);
      
  
      const application = await applicationModel.findOneAndDelete({ _id: id, student: userId });
  
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      res.status(200).json({ message: "Application withdrawn successfully" });
    } catch (error) {
      console.error("Error withdrawing application:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


export { applyJob, getAppliedJobs, getJobApplications, updateApplicationStatus };
