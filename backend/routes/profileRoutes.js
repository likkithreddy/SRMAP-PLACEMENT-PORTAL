import express from "express"
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { getUserDetails, updateUserDetails } from "../controllers/profileController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/",authenticateUser,getUserDetails);
profileRouter.put("/update",authenticateUser,upload,updateUserDetails);


export default profileRouter;