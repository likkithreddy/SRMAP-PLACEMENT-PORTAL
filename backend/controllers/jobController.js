import jobModel from "../models/jobModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// 📌 1. POST: Create a new job (Only Recruiters)
const postJob = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "recruiter") {
            return res.status(403).json({ success: false, message: "Access denied. Recruiters only." });
        }

        let descriptionFileUrl = null;
        let companyLogoUrl = null;

        if (req.files?.descriptionFile) {
            descriptionFileUrl = await uploadOnCloudinary(req.files.descriptionFile[0].path, "raw");
        }
        if (req.files?.companyLogo) {
            companyLogoUrl = await uploadOnCloudinary(req.files.companyLogo[0].path, "image");
        }

        const newJob = new jobModel({
            recruiter: req.user._id, // Associate job with recruiter
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            salary: req.body.salary,
            minCGPA: req.body.minCGPA,
            jobType: req.body.jobType,
            category: req.body.category,
            experience: req.body.experience,
            description: req.body.description,
            descriptionFile: descriptionFileUrl,
            companyLogo: companyLogoUrl,
        });

        await newJob.save();
        res.status(201).json({ success: true, message: "Job posted successfully!", job: newJob });

    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ success: false, message: "Error posting job", error: error.message });
    }
};

// 📌 2. GET: Fetch all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch jobs", error: error.message });
    }
};

// 📌 3. GET: Fetch a single job by ID
const getSingleJob = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch job", error: error.message });
    }
};

// 📌 4. GET: Fetch jobs posted by a specific recruiter
const getRecruiterJobs = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "recruiter") {
            return res.status(403).json({ success: false, message: "Access denied. Recruiters only." });
        }

        const jobs = await jobModel.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch recruiter's jobs", error: error.message });
    }
};

// 📌 5. PUT: Update a job by ID (Only Recruiters)
const updateJob = async (req, res) => {
    try {
        let descriptionFileUrl = null;

        if (req.files?.descriptionFile) {
            descriptionFileUrl = await uploadOnCloudinary(req.files.descriptionFile[0].path, "raw");
        }

        const job = await jobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // ✅ Ensure only the recruiter who posted the job can update it
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Access denied. You can only update your own job postings." });
        }

        const updatedJob = await jobModel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                descriptionFile: descriptionFileUrl || job.descriptionFile,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ success: false, message: "Failed to update job", error: error.message });
    }
};

// 📌 6. DELETE: Remove a job by ID (Only Recruiters)
const deleteJob = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // ✅ Ensure only the recruiter who posted the job can delete it
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Access denied. You can only delete your own job postings." });
        }

        await jobModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete job", error: error.message });
    }
};

export { getAllJobs, postJob, getSingleJob, getRecruiterJobs, updateJob, deleteJob };
