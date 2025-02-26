import express from "express"
import connectDB from "./config/db.js";
import cors from "cors"
import "dotenv/config" 
import studentRouter from "./routes/studentRoutes.js";
import recruiterRouter from "./routes/recruiterRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import profileRouter from "./routes/profileRoutes.js";



// App Config
const app = express();
const PORT = process.env.PORT || 3000;
connectDB()

// middlewares 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())


// api endpoints 
app.use("/api/students/auth",studentRouter)
app.use("/api/recruiters/auth",recruiterRouter)
app.use("/api/jobs",jobRouter)
app.use("/api/jobs/apply",applicationRouter)
app.use("/api/user/profile",profileRouter)


app.use("/",(req,res)=>{
   
    res.send("Hello")
})

app.listen(PORT,()=>{
    console.log(`app is listening on port ${PORT}`);
    
})