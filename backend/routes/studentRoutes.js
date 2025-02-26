import express from "express"
import { studentLogin,studentRegister } from "../controllers/userController.js";
const studentRouter = express.Router();
// import verifyToken from "../middlewares/authMiddleware.js"
import {upload} from "../middlewares/multerMiddleware.js"



studentRouter.post("/login",studentLogin)
studentRouter.post("/register",upload,studentRegister)
// studentRouter.post("/random",verifyToken,(req,res)=>{
//     res.status(200).json({ message: 'Token Verified' });
// })


export default studentRouter