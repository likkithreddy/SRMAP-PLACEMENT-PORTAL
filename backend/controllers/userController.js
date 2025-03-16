import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import "dotenv/config"
import jwt from "jsonwebtoken"
import validator from "validator"
import uploadOnCloudinary from "../utils/cloudinary.js"

const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email,password);

        const user = await userModel.findOne({ email, role: "student" })
        // console.log(user);

        if (!user) {
            return res.status(401).json({ message: 'User does not exists' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Password incorrect' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ success: "true", token });
    } catch (error) {
        console.log(error);

        res.status(500).json({ sucess: "false", message: error });
    }
}
const studentRegister = async (req, res) => {
    try {
        const { name, email, password,
            phoneNumber,
            firstName,
            lastName,
            dateOfBirth,
            qualification,
            department,
            yearOfStudy,
            cgpa,
            address,
            city,
            state,
            zipCode } = req.body;
        // if (!req.file) {
        //     return res.status(400).json({ error: "No file uploaded" });
        // }
        // const localFilePath = req.file.path;
        // console.log(localFilePath);

        // const resumeUrl = await uploadOnCloudinary(localFilePath);

        if (!req.files || (!req.files.resume && !req.files.passportSizePhoto)) {
            return res.status(400).json({ error: "Resume and passport photo are required" });
        }

        let resumeUrl = null, photoUrl = null;

        // Upload Resume to Cloudinary (PDF)
        if (req.files.resume) {
            resumeUrl = await uploadOnCloudinary(req.files.resume[0].path, "raw");
        }

        // Upload Passport Photo to Cloudinary (Image)
        if (req.files.passportSizePhoto) {
            photoUrl = await uploadOnCloudinary(req.files.passportSizePhoto[0].path, "image");
        }

        const resume = resumeUrl;
        const passportSizePhoto = photoUrl;


        const user = await userModel.findOne({ email, role: "student" })
        // console.log(user);
        if (user) {
            return res.json({ success: false, message: "User already exits" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter a strong password " })

        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name, email, password: hashedPassword, role: "student", resume, phoneNumber,
            firstName,
            lastName,
            dateOfBirth,
            qualification,
            department,
            yearOfStudy,
            cgpa,
            passportSizePhoto,
            address,
            city,
            state,
            zipCode
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);


        res.status(200).json({ message: 'Student registered successfully', token, resumeUrl, photoUrl });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}
const recruiterLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const recruiterEmail = email;
        console.log(recruiterEmail);


        const user = await userModel.findOne({ recruiterEmail, role: "recruiter" })
        if (!user) {
            return res.status(401).json({ message: 'User does not exits' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Password incorrect' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ success: "true", token });
    } catch (error) {
        console.log(error);

        res.status(500).json({ sucess: "false", message: error.message });
    }
}
const recruiterRegister = async (req, res) => {
    try {
        const { 
            name, password, phoneNumber, companyName, companyWebsite, 
            companyEmail, contactNumber, recruiterName, recruiterEmail, 
            designation, address, city, state, zipCode 
        } = req.body;

        console.log(req.body); // Logs other form fields
        console.log(req.files); // Logs uploaded files

        if (!req.files || (!req.files.authorizationLetter || !req.files.companyLogo)) {
            return res.status(400).json({ error: "Authorization Letter and Company Logo are required" });
        }

        let authorizationLetterUrl = null, companyLogoUrl = null;

        if (req.files.authorizationLetter) {
            authorizationLetterUrl = await uploadOnCloudinary(req.files.authorizationLetter[0].path, "raw");
        }

        if (req.files.companyLogo) {
            companyLogoUrl = await uploadOnCloudinary(req.files.companyLogo[0].path, "image");
        }

        const authorizationLetter = authorizationLetterUrl;
        const companyLogo = companyLogoUrl;

        // Check if recruiter already exists
        const user = await userModel.findOne({ recruiterEmail, role: "recruiter" });
        if (user) {
            return res.status(400).json({ success: false, message: "Recruiter already exists" });
        }

        // Validate emails
        if (!validator.isEmail(recruiterEmail) || !validator.isEmail(companyEmail)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new recruiter
        const newUser = new userModel({
            name, password: hashedPassword, role: "recruiter", phoneNumber,
            companyName, companyWebsite, companyEmail, contactNumber, 
            recruiterName, recruiterEmail, designation, address, city, 
            state, zipCode, companyLogo, authorizationLetter
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        res.status(200).json({ message: "Recruiter registered successfully", token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};



export { studentLogin, studentRegister, recruiterLogin, recruiterRegister }