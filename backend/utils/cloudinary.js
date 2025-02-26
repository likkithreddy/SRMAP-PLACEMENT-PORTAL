import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload files to Cloudinary
const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    fs.unlinkSync(localFilePath); // Remove local file after upload
    return response.secure_url;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove file if upload fails
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadOnCloudinary;




// // Upload File to Cloudinary
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//       const response = await cloudinary.uploader.upload(localFilePath, {
//         resource_type: "raw",
//       });
//       fs.unlinkSync(localFilePath);  // Remove the local file after successful upload
//       return response.secure_url;
//     } catch (error) {
//       fs.unlinkSync(localFilePath);  // Remove the local file if the upload fails
//       throw new Error("Cloudinary upload failed");
//     }
//   };


// export default uploadOnCloudinary;

