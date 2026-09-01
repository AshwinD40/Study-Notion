import "./App.css";
import {Route, Routes , useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";

import Navbar from "./shared/components/Navbar";
import OpenRoute from "./features/auth/components/OpenRoute";
import PrivateRoute from "./features/auth/components/PrivateRoute";
import AddCourse from "./features/dashboard/components/AddCourse";
import Cart from "./features/dashboard/components/Cart";
import EditCourse from "./features/dashboard/components/EditCourse/Index";
import EnrolledCourses from "./features/dashboard/components/EnrolledCourses";
import Instructor from "./features/dashboard/components/InstructorDashboard/Instructor";
import MyCourses from "./features/dashboard/components/MyCourses";
import MyProfile from "./features/dashboard/components/MyProfile";
import Settings from "./features/dashboard/components/Settings";
import VideoDetails from "./features/learning/components/VideoDetails";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import Contact from "./pages/ContactUs";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import ViewCourse from "./pages/ViewCourse";

import { getUserDetails } from "./features/profile/api/profile.api";
import { ACCOUNT_TYPE } from "./utils/constants";
import { getStoredToken } from "./utils/storage";
import { useEffect } from "react";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const token = getStoredToken()
    if(token){
      dispatch(getUserDetails(token, navigate))
    }
  }, [dispatch, navigate])

  return (
   <div className="w-screen min-h-screen bg-gray-950 flex flex-col font-geist">
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
      <Route path="login" 
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />

      <Route path="forgot-password"
        element={
          <OpenRoute>
            <ForgotPassword/>
          </OpenRoute>
        }
      />
      <Route path="update-password/:id"
        element={
          <OpenRoute>
            <UpdatePassword/>
          </OpenRoute>
        }
      />
      <Route path="verify-email"
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
