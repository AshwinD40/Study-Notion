import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import IconBtn from '../../common/IconBtn'
import {IoMdAddCircleOutline} from 'react-icons/io'
import CourseTable from './InstructorCourses/CourseTable'

const MyCourses = () => {

    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses , setCourses] = useState([])

    useEffect( () => {
        const fetchCourses = async () => {
            const result = await fetchInstructorCourses(token)
            if(result){
                setCourses(result)
            }
        }
        fetchCourses();

    },[token])
  return (
    <div className=' text-white'>
      <div className=' flex justify-between mb-10'>      
        <h1 className=' text-richblack-5 font-bold text-2xl'>   
          My Courses
        </h1>
        <IconBtn 
          text="Add New"
          onclick={() => {
            navigate("/dashboard/add-course")
          }}
        >
          <IoMdAddCircleOutline />
          </IconBtn>
      
      </div>

      {courses && <CourseTable  courses={courses} setCourses={setCourses}/>}
    </div>
  )

}

export default MyCourses