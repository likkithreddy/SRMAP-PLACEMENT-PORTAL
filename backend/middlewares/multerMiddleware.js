import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public"); // Temporary storage before uploading to Cloudinary
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get file extension
    const baseName = path.basename(file.originalname, ext); // Get filename without extension
    cb(null, baseName + "-" + Date.now() + ext); // Preserve original filename + timestamp
  },
});

// Allow multiple file uploads (resume & passport photo)
export const upload = multer({ storage: storage }).fields([
  { name: "resume", maxCount: 1 },  // Resume (PDF)
  { name: "passportSizePhoto", maxCount: 1 },
  {name: "descriptionFile", maxCount: 1},
  {name: "companyLogo",maxCount:1},
  { name: "authorizationLetter", maxCount: 1 } 
]);
