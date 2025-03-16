import React from 'react'
// import StudentLogin from './pages/StudentLogin'
import Navbar from './components/Navbar'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import StudentRegister from "./pages/StudentRegister"
// import RecruiterLogin from "./pages/RecruiterLogin"
import RecruiterRegister from "./pages/RecruiterRegister"
import Login from './pages/Login'
import Register from './pages/Register'
import AppliedJobs from './pages/AppliedJobs'
import ViewProfile from './pages/ViewProfile'
import PostJob from './pages/PostJob'
import Applications from './pages/Applications'
import Jobs from './pages/Jobs'
import RecruiterDashboard from './pages/RecruiterDashboard'
import StudentDashboard from './pages/StudentDashboard'
import ApplyJob from './pages/ApplyJob'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import JobDetails from './pages/JobDetails'

// import VerifyCode from './pages/VerifyCode'


const App = () => {
  return (
    <div>

      <BrowserRouter>
          <Navbar/>
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace/>} />
          <Route path='/jobs' element={<Jobs/>} />
          <Route path='/StudentRegister' element={<StudentRegister />} />
          <Route path='/RecruiterRegister' element={<RecruiterRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-jobs" element={<AppliedJobs />} />
          <Route path="/profile" element={<ViewProfile />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/apply-job/:jobId" element={<ApplyJob />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/job-details/:jobId" element={<JobDetails />} />
          {/* <Route path="/verifycode" element={<VerifyCode />} /> */}



          {/* <Route path='api/students/auth/login' element={<StudentLogin />} />
          <Route path='api/recruiters/auth/login' element={<RecruiterLogin />} /> */}
        </Routes>
        
      </BrowserRouter>


    </div>
  )
}

export default App