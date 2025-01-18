import React from 'react'
import { useState } from 'react'
import {Chart , registerables } from "chart.js"
import {Pie} from "react-chartjs-2"

Chart.register(...registerables);

const InstructorChart = ({courses}) => {
    const [currChart , setCurrChart] = useState("Students")

    // function to generate random colors
    const getRandomColors = (numColors) =>{
        const colors = []
        for(let i=0 ; i < numColors ; i++){
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
                Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)})`
            colors.push(color);
        }
        return colors;
    }

    // create data for chart displaying student info

    const chartDataForStudents = {
        labels: courses.map((courses) => courses.courseName) ,
        datasets:[
            {
                data:courses.map((courses) => courses.totalStudentEnrolled),
                backgroundColor: getRandomColors(courses.length),

            }
        ]
    }

    // create data for chart displaying income info

    const chartDataForIncome =  {
        labels: courses.map((courses) => courses.courseName) ,
        datasets:[
            {
                data:courses.map((courses) => courses.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length),

            }
        ]
    }

    // create options

    const options = {
        maintainAspectRatio: false,
    }
  return (
    <div className=' flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6'>
        <p className=' text-lg font-bold text-richblack-5'>Visualise</p>
        <div className=' space-x-4 font-semibold'>
            <button
                onClick={() => setCurrChart("Students")}
                className={`rounded-md p-1 px-3 transition-all duration-200 ${
                    currChart === "Students"
                        ? "bg-richblack-700 text-yellow-50"
                        : "text-richblack-5"}`}
            >
                Student
            </button>
            <button
                onClick={() => setCurrChart("Income")}
                className={` rounded-md p-1 px-3 transition-all duration-200 ${
                    currChart === "Income"
                        ? " bg-richblack-700 text-yellow-50"
                        : " text-richblack-5"}`}
            >
                Income
            </button>
        </div>
        <div>
            <Pie
                data={currChart === "Students" ? chartDataForStudents : chartDataForIncome}
                options={options}
            />
        </div>
    </div>
  )
}

export default InstructorChart