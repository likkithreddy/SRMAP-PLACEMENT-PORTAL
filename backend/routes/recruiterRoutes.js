import express from "express"
import { recruiterLogin,recruiterRegister } from "../controllers/userController.js";
import {upload} from "../middlewares/multerMiddleware.js"

const recruiterRouter = express.Router();


recruiterRouter.post("/login",recruiterLogin)
recruiterRouter.post("/register",upload,recruiterRegister)


export default recruiterRouter