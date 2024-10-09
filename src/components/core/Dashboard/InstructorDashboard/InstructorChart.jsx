import React from 'react'
import { useState } from 'react'
import {Chart , registerables } from "chart.js"
import {Pie} from "react-chartjs-2"

Chart.register(...registerables);

const InstructorChart = ({courses}) => {
    const [currChart , setCurrChart] = useState("Students")

    // function to generate random colors
    const getRandomColors = (numColors) =>{
        const colors = [];
        for(let i=0 ; i<numColors ; i++){
            const color = `rgb(${Math.floor(Math.random() * 256)}), ${Math.floor(Math.random() * 256)},
            ${Math.floor(Math.random() * 256)}`
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

    }
  return (
    <div className=' lg:w-[75%] bg-richblack-800 rounded-lg p-10 '>
        <p>Visualise</p>
        <div className=' flex gap-5'>
            <button
                onClick={() => setCurrChart("Students")}
            >
                Student
            </button>
            <button
            onClick={() => setCurrChart("Income")}
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