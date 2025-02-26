import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (assuming recruiters are stored here)
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String, // Can be a range, e.g., "₹5,00,000 - ₹8,00,000"
      required: true,
    },
    minCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      default: "Full-Time",
    },
    category: {
      type: String,
      enum: ["Software", "Finance", "Marketing", "HR", "Other"],
      default: "Software",
    },
    experience: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior Level"],
      default: "Entry Level",
    },
    description: {
      type: String,
      required: true,
    },
    descriptionFile: {
      type: String, // Store file URL (PDF)
      default: null,
    },
    companyLogo: {
      type: String, 
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const jobModel = mongoose.model("Job", jobSchema);

export default jobModel;
