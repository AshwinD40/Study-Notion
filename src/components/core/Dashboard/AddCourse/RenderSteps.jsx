import React from "react";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";

import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import PublishCourse from "./PublishCourse";

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];

  return (
    <>
      {/* Glassy stepper container */}
      <div className="w-full rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-4 md:px-6 md:py-5 mb-4">
        {/* Top row: circles + connectors */}
        <div className="relative flex w-full items-center justify-between gap-3 md:gap-4">
          {steps.map((item, index) => {
            const isActive = step === item.id;
            const isCompleted = step > item.id;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={item.id}>
                <div className="flex flex-col items-center min-w-[34px]">
                  <button
                    className={[
                      "grid cursor-default aspect-square w-[34px] place-items-center rounded-full border text-sm transition-all duration-200",
                      isActive &&
                        "border-yellow-200 bg-yellow-50 text-richblack-900 shadow-[0_0_18px_rgba(255,214,10,0.6)]",
                      isCompleted &&
                        "border-caribbeangreen-200 bg-caribbeangreen-200 text-richblack-900 shadow-[0_0_18px_rgba(6,214,160,0.6)]",
                      !isActive &&
                        !isCompleted &&
                        "border-richblack-700 bg-richblack-800/90 text-richblack-300",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled
                  >
                    {isCompleted ? (
                      <FaCheck className="font-bold text-xs" />
                    ) : (
                      item.id
                    )}
                  </button>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    className={[
                      "h-[1px] md:h-[2px] flex-1 mx-1 md:mx-2 border-b border-dashed",
                      step > item.id
                        ? "border-caribbeangreen-200"
                        : "border-richblack-600",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Labels */}
        <div className="mt-3 flex w-full select-none justify-between gap-2">
          {steps.map((item) => (
            <div
              key={item.id}
              className="flex min-w-[90px] flex-1 flex-col items-center gap-y-1"
            >
              <p
                className={[
                  "hidden sm:block text-[11px] md:text-sm font-medium text-center leading-snug",
                  step >= item.id
                    ? "text-richblack-5"
                    : "text-richblack-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Forms */}
      <div className="w-full">
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>
    </>
  );
};


export default RenderSteps;
