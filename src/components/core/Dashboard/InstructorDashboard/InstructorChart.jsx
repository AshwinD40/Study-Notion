import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  const [currChart, setCurrChart] = useState("Students");

  // Neon colors
  const NEON_COLORS = [
    "#2CE5A7", // green
    "#FBCB4A", // yellow
    "#FF7AB5", // pink
    "#6DDFFD", // cyan
    "#C084FC", // purple
    "#FF8E6E", // coral
  ];

  const getNeonColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(NEON_COLORS[i % NEON_COLORS.length]);
    }
    return colors;
  };

  const chartDataForStudents = {
    labels: courses.map((c) => c.courseName),
    datasets: [
      {
        label: "Students",
        data: courses.map((c) => c.totalStudentEnrolled),
        backgroundColor: getNeonColors(courses.length),
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const chartDataForIncome = {
    labels: courses.map((c) => c.courseName),
    datasets: [
      {
        label: "Revenue",
        data: courses.map((c) => c.totalAmountGenerated),
        backgroundColor: getNeonColors(courses.length),
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: {
            size: 12,
            family: "Inter",
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.6)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return (
    <div
      className="  rounded-3xl   bg-white/10   backdrop-blur-2xl   border border-white/15   shadow-[0_18px_60px_rgba(0,0,0,0.55)]   p-4 md:p-6 flex flex-col gap-y-4 w-full h-full "
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-richblack-5">Visualization</p>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrChart("Students")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
              currChart === "Students"
                ? "bg-yellow-400/20 text-yellow-200 border border-yellow-300/40"
                : "text-richblack-200 hover:text-yellow-50"
            }`}
          >
            Students
          </button>

          <button
            onClick={() => setCurrChart("Income")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
              currChart === "Income"
                ? "bg-yellow-400/20 text-yellow-200 border border-yellow-300/40"
                : "text-richblack-200 hover:text-yellow-50"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="relative h-[260px] md:h-[300px] lg:h-[340px]">
        <Pie
          data={currChart === "Students" ? chartDataForStudents : chartDataForIncome}
          options={options}
        />
      </div>
    </div>
  );
};

export default InstructorChart;
