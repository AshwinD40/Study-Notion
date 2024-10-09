import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {getInstructorData} from "../../../../services/operations/profileAPI"
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';


const Instructor = () => {

    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false);
    const [instructorData , setInstructorData] = useState(null)
    const [courses , setCourses] = useState([]);

    
    useEffect(() => {
        const getCourseDataWithState = async() =>{
            setLoading(true);

            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            console.log(instructorApiData)

            if(instructorApiData.length){
                setInstructorData(instructorApiData)
            }
            if(result ){
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithState();

    },[])

    const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0 )
    const totalStudents = instructorData?.reduce((acc, curr ) => acc + curr.totalStudentEnrolled , 0)

  return (
    <div className=' text-white w-11/12'>
        
        <div className=' flex flex-col mb-5'>
            <h1 className=' font-bold text-xl'>Hi {user?.firstName}👋</h1>
            <p>Let{"'"}s start something New</p>
        </div>

        {
            loading 
                ? (<div className='spinner'></div>) 
                : courses.length > 0
                    ? (
                        <div className=' flex flex-col gap-5'>
                            <div className='  flex lg:flex-row md:flex-row sm:flex-row flex-col gap-5'>
                                <InstructorChart courses={instructorData}/>
                                <div className=' lg:w-[25%] flex flex-col text-lg font-bold gap-2 p-3 bg-richblack-800 rounded-md'>
                                    <h1 className=' text-xl font-bold text-caribbeangreen-300-400 text-center'>Statistics</h1>
                                    <div className=' flex gap-2'>
                                        <p className=' text-pink-300'>Total Courses : </p>
                                        <p>{courses.length}</p>
                                    </div>
                                    <div className=' flex gap-2'>
                                        <p className=' text-yellow-200'>Total Students : </p>
                                        <p>{totalStudents}</p>
                                    </div>
                                    <div className=' flex gap-2'>
                                        <p className=' text-caribbeangreen-300'>Total Amount : </p>
                                        <p>Rs. {totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* Link your courses */}
                                <div className=' flex justify-between px-2 mb-3'>
                                    <p className=' text-xl font-bold '>Your Courses</p>
                                    <Link to="/dashboard/my-courses">
                                        <p className=' text-yellow-200 font-bold'>View all</p>

                                    </Link>
                                </div>
                                <div className=' flex justify-around p-3 bg-richblack-800 rounded-md border-[1px] border-richblack-600 '>
                                    {
                                        courses.slice(0,3).map((course) =>(
                                            <div>
                                                <img 
                                                    src={course.thumbnail}
                                                    height="250px"
                                                    width="340px"
                                                    className=' rounded-md'
                                                />
                                                <div>
                                                    <p className=' text-caribbeangreen-300 font-bold'>{course.courseName}</p>
                                                    <div className=' flex gap-2'>
                                                        <p className=' text-richblack-400'>{course.studentsEnrolled.length} Student</p>
                                                        <p> | </p>
                                                        <p className=' text-richblack-400'>Price: {course.price}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                                
                            </div>

                        </div>
                    )
                    : (
                        <div>
                            <p>You have not created any courses yet!</p>
                            <Link to="/dashboard/addCourse">
                                Create new Course
                            </Link>
                        </div>)
        }
    </div>
  )
}

export default Instructor