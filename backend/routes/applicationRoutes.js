import express from "express";
import { applyJob, getAppliedJobs, getJobApplications, updateApplicationStatus, withdrawApplication,getUpcomingInterviews, getAppliedJobDetails } from "../controllers/applicationController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { authenticateUser, verifyRecruiter } from "../middlewares/authMiddleware.js";


const applicationRouter = express.Router();

// Protect the apply route with authentication
applicationRouter.post("/:id", authenticateUser, upload, applyJob);
applicationRouter.get("/applied", authenticateUser,getAppliedJobs );
applicationRouter.get("/applications",authenticateUser, verifyRecruiter,getJobApplications );
applicationRouter.put("/applications/:id",authenticateUser, verifyRecruiter,updateApplicationStatus );
applicationRouter.delete("/applications/withdraw/:id",authenticateUser,withdrawApplication );
applicationRouter.get("/upcoming-interviews", authenticateUser, getUpcomingInterviews);
applicationRouter.get("/:id", authenticateUser, getAppliedJobDetails);



export default applicationRouter;
