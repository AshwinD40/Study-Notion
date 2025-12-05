import React from "react";
import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-richblack-900">
      <div className="mx-auto w-11/12 max-w-[1200px] ">  
        <h1 className="mb-4 md:mb-6 text-3xl md:text-4xl font-semibold text-white tracking-wide">
          Add Course
        </h1>
        <div className="flex flex-col lg:flex-row gap-10 lg:items-start">

          {/* LEFT SECTION */}
          <div className="flex flex-1 flex-col">

            <div
              className="w-full rounded-3xl bg-richblack-800/90 border border-richblack-700 shadow-[0_18px_60px_rgba(0,0,0,0.6)] px-4 py-5 md:px-8 md:py-8"
            >
              <RenderSteps />
            </div>
          </div>

          {/* RIGHT SECTION (Tips Card) */}
          <aside className="hidden xl:block w-full max-w-[360px] sticky top-20">
            <div
              className=" rounded-3xl  bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_20px_60px_rgba(255,255,255,0.1)] px-6 py-7"
            >
              <p className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-neon-300 text-2xl">⚡</span>
                Upload Tips
              </p>

              <ul className="list-disc ml-4 space-y-3 text-sm text-white/90">
                <li>Set a price or make the course free.</li>
                <li>Thumbnail recommended size: 1024×576.</li>
                <li>The overview video is controlled in the Video section.</li>
                <li>Build & organize content in the Course Builder.</li>
                <li>Add topics to unlock lessons, quizzes & assignments.</li>
                <li>Additional Data affects the public course page.</li>
                <li>Use Announcements for important updates.</li>
                <li>Send Notes to all enrolled students instantly.</li>
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
