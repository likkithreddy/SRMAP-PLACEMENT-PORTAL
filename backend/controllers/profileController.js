import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import "dotenv/config"
import jwt from "jsonwebtoken"
import validator from "validator"
import uploadOnCloudinary from "../utils/cloudinary.js"


const getUserDetails = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        // console.log(user);
        

        // Prevent updating email and role for security reasons
        const { email, role, ...updateFields } = req.body;
        console.log(updateFields);
        

        // Update text-based fields from req.body
        Object.assign(user, updateFields);

        // Handle optional file uploads (Profile Photo & Resume)
        if (req.files?.passportSizePhoto) {
            const photoUrl = await uploadOnCloudinary(req.files.passportSizePhoto[0].path, "image");
            user.passportSizePhoto = photoUrl;
        }
        if (req.files?.resume) {
            const resumeUrl = await uploadOnCloudinary(req.files.resume[0].path, "raw");
            user.resume = resumeUrl;
        }
        if (req.files?.companyLogo) {
            const companyLogoUrl = await uploadOnCloudinary(req.files.companyLogo[0].path, "image");
            user.companyLogo = companyLogoUrl;
        }
        if (req.files?.authorizationLetter) {
            const authorizationLetterUrl = await uploadOnCloudinary(req.files.authorizationLetter[0].path, "raw");
            user.authorizationLetter = authorizationLetterUrl;
        }

        

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { getUserDetails,updateUserDetails }