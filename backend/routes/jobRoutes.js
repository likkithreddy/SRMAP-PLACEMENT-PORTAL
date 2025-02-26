import express from "express"
import {getAllJobs, postJob, getSingleJob, updateJob, deleteJob, getRecruiterJobs} from "../controllers/jobController.js"
import {upload} from "../middlewares/multerMiddleware.js"
import { authenticateUser, verifyRecruiter } from "../middlewares/authMiddleware.js";


const jobRouter = express.Router();

jobRouter.post("/",authenticateUser,verifyRecruiter,upload,postJob) //Create a new job
jobRouter.get("/recruiter",authenticateUser,verifyRecruiter,getRecruiterJobs) //get recruiter posted jobs
jobRouter.get('/',authenticateUser,getAllJobs) // Fetch all jobs
jobRouter.get('/:id',authenticateUser,getSingleJob) //Fetch a single job
jobRouter.put("/:id",authenticateUser,upload,updateJob) //Update a job
jobRouter.delete("/:id",authenticateUser,deleteJob) //Delete a job   

export default jobRouter