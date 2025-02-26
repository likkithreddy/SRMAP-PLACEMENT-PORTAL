import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Common Fields
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ["student", "recruiter"] },
    phoneNumber: String,

    // Student-Specific Fields
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    qualification: { type: String, enum: ["B.Tech", "M.Tech", "MCA", "MBA"] },
    cgpa: Number,
    department: { type: String, enum: ["CSE", "ECE", "EEE", "IT", "ME", "CE"] },
    yearOfStudy: { type: Number, enum: [1, 2, 3, 4] },
    cgpa: Number,
    resume: String,
    passportSizePhoto: String,

    // Recruiter-Specific Fields

    companyName: String,
    companyWebsite: String,
    companyEmail: String,
    contactNumber: String,


    recruiterName: String,
    recruiterEmail: String,
    designation: String,


    address: String,
    city: String,
    state: String,
    zipCode: String,
    companyLogo: String,
    authorizationLetter: String,
  },
  {
    timestamps: true,
  }
);

const userModel =  mongoose.model("User", userSchema);

export default userModel;
