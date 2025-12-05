import "./App.css";
import {Route, Routes , useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";

import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import AddCourse from "./components/core/Dashboard/AddCourse";
import Cart from "./components/core/Dashboard/Cart";
import EditCourse from "./components/core/Dashboard/EditCourse/Index";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import MyCourses from "./components/core/Dashboard/MyCourses";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import VideoDetails from "./components/core/viewCourse/VideoDetails";
import About from "./Pages/About";
import Catalog from "./Pages/Catalog";
import Contact from "./Pages/ContactUs";
import CourseDetails from "./Pages/CourseDetails";
import Dashboard from "./Pages/Dashboard";
import Error from "./Pages/Error";
import ForgotPassword from "./Pages/ForgotPassword";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import ViewCourse from "./Pages/ViewCourse";

import { getUserDetails } from "./services/operations/profileAPI";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useEffect } from "react";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if(localStorage.getItem("token")){
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
  }, [])

  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about"  element={ <About/>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="courses/:courseId" element={<CourseDetails/>} />
      <Route path = "catalog/:catalogName" element={<Catalog/>} />
      
      <Route
        path="signup"
        element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        }
      />
      <Route
        path="login"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />

      <Route
        path="forgot-password"
        element={
          <OpenRoute>
            <ForgotPassword/>
          </OpenRoute>
        }
      />
      <Route
        path="update-password/:id"
        element={
          <OpenRoute>
            <UpdatePassword/>
          </OpenRoute>
        }
      />
      <Route
        path="verify-email"
        element={
          <OpenRoute>
            <VerifyEmail/>
          </OpenRoute>
        }
      />
        
      <Route
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
      <Route path="dashboard/my-profile"  element={ <MyProfile /> }/>
        <Route path="dashboard/Settings" element={<Settings />} />

        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
            </>
          )
        }

        {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse/>}/>
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/> 
            </>
          )
        }
      </Route>
      <Route element = {
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>
      }>
        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route 
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails/>}
              />
            </>
          )
        }
      </Route>
  
      <Route path="*" element={
          <Error/>
        }
      />   
    </Routes>
   </div>
  );
}

export default App;
