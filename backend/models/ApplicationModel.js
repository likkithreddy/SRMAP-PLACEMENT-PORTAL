import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Student model
    required: true,
  },
  studentName: {
    type: String,
    required: true, // Store student's name
  },
  studentEmail: {
    type: String,
    required: true, // Store student's email
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Reference to the Job model
    required: true,
  },
  resume: {
    type: String, // URL of the uploaded resume
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending", // Default status when application is submitted
  },
  appliedAt: {
    type: Date,
    default: Date.now, // Timestamp when the student applied
  },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  minCGPA: { type: Number, required: true },
  jobType: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  companyLogo: { type: String }, // URL for company logo
});

const applicationModel = mongoose.model("Application", applicationSchema);

export default applicationModel;
